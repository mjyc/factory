import log from 'meteor/mjyc:loglevel';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { defaultAction, getActionServer } from 'meteor/mjyc:action';

const logger = log.getLogger('vision');

export const Detections = new Mongo.Collection('detections');


if (Meteor.isClient) {

  // Below code is adapted from
  //   https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/camera.js
  //   https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/demo_util.js
  //   https://github.com/eduardolundgren/tracking.js/blob/master/examples/face_camera.html

  import dat from 'dat.gui';
  import Stats from 'stats.js';
  import * as posenet from '@tensorflow-models/posenet';
  import 'tracking';
  import 'tracking/build/data/face-min.js';


  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  }

  const isiOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  const isMobile = () => {
    return isAndroid() || isiOS();
  }

  setupCamera = async (video) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw 'Browser API navigator.mediaDevices.getUserMedia not available';
    }

    const mobile = isMobile();
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        width: mobile ? undefined : this.width,
        height: mobile ? undefined: this.height}
    });
    video.srcObject = stream;

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  const stopCamera = (video) => {
    let track;
    if (video && video.srcObject && video.srcObject.getVideoTracks().length === 1) {
      track = video.srcObject.getVideoTracks()[0];
    } else {
      logger.warn('Invalid input video:', video);
      return video;
    }
    // On Chrome 67, "track.onended" was not being called on "stop"
    track.stop();
  }

  export class VideoControlAction {
    constructor(
      collection,
      id,
      video = document.getElementById('video'),
      setState = () => {},
    ) {
      this._as = getActionServer(collection, id);
      this._as.registerGoalCallback(this.goalCB.bind(this));
      this._as.registerPreemptCallback(this.preemptCB.bind(this));

      this.setVideo(video);
      this.setSetState(setState);
    }

    setVideo(video) {
      if (!video) {
        logger.warn('Invalid input video:', video);
        return this;
      };
      this._video = video;
      return this;
    }

    setSetState(setState) {
      this._setState = setState;
    }

    async goalCB({goal} = {}) {
      try {
        switch (goal.type) {
          case 'play':
            this._video = await setupCamera(this._video);
            break;
          case 'stop':
            stopCamera(this._video);
            break;
          default:
            throw new Error(`Invalid input type: ${goal.type}`);
        }
        this._setState({
          showVisionViz: goal.config && goal.config.showVisionViz
        });
        this._as.setSucceeded();
      } catch (err) {
        this._as.setAborted(err);
      }
    }

    preemptCB() {
      this._as.setPreempted();
    }
  }

  class Detector {
    setParams(params) {
      new Error('Not implemented');
    }

    getParams() {
      new Error('Not implemented');
    }

    setVideo() {
      new Error('Not implemented');
    }

    async detect() {
      new Error('Not implemented');
    }
  }

  const defaultPoseDetectorParams = {
    algorithm: 'multi-pose',
    input: {
      mobileNetArchitecture: isMobile() ? '0.50' : '0.75',
      outputStride: 16,
      flipHorizontal: true,
      imageScaleFactor: 0.5,
    },
    singlePoseDetection: {
      minPoseConfidence: 0.1,
      minPartConfidence: 0.5,
    },
    multiPoseDetection: {
      maxPoseDetections: 5,
      minPoseConfidence: 0.15,
      minPartConfidence: 0.1,
      nmsRadius: 30.0,
    },
  };

  class PoseDetector extends Detector {
    constructor(video = document.getElementById('video')) {
      super();

      this._net = null;

      this.setVideo(this._video);
      this.setParams(defaultPoseDetectorParams);
    }

    getParams() {
      return this._params;
    }

    setParams({
      algorithm = defaultPoseDetectorParams.algorithm,
      input = defaultPoseDetectorParams.input,
      singlePoseDetection = defaultPoseDetectorParams.singlePoseDetection,
      multiPoseDetection = defaultPoseDetectorParams.multiPoseDetection,
    } = {}) {
      this._params = {
        algorithm: algorithm,
        input: Object.assign(defaultPoseDetectorParams.input, input),
        singlePoseDetection: Object.assign(
          defaultPoseDetectorParams.singlePoseDetection,
          singlePoseDetection,
        ),
        multiPoseDetection: Object.assign(
          defaultPoseDetectorParams.multiPoseDetection,
          multiPoseDetection,
        ),
      }
      return this;
    }

    setVideo(video) {
      if (!video) {
        logger.warn('Invalid input video:', video);
        return this;
      };
      this._video = video;
      return this;
    }

    async detect() {
      if (!this._video) {
        logger.warn('Skipping; no video input');
        return;
      };

      if (!this._net) {
        this._net = await posenet.load(
          Number(this._params.input.mobileNetArchitecture)
        );
      }
      if (this._params.changeToArchitecture) {
        this.net.dispose();
        this.net = await posenet.load(Number(this._params.changeToArchitecture));
        this._params.changeToArchitecture = null;
      }

      const imageScaleFactor = this._params.input.imageScaleFactor;
      const flipHorizontal = this._params.input.flipHorizontal;
      const outputStride = Number(this._params.input.outputStride);

      let poses = [];
      let minPoseConfidence;
      let minPartConfidence;
      switch (this._params.algorithm) {
        case 'single-pose':
          const pose = await this._net.estimateSinglePose(
            this._video, imageScaleFactor, flipHorizontal, outputStride
          );
          poses.push(pose);

          minPoseConfidence = Number(
            this._params.singlePoseDetection.minPoseConfidence);
          minPartConfidence = Number(
            this._params.singlePoseDetection.minPartConfidence);
          break;
        case 'multi-pose':
          poses = await this._net.estimateMultiplePoses(
            this._video,
            imageScaleFactor,
            flipHorizontal,
            outputStride,
            this._params.multiPoseDetection.maxPoseDetections,
            this._params.multiPoseDetection.minPartConfidence,
            this._params.multiPoseDetection.nmsRadius);

          minPoseConfidence
            = Number(this._params.multiPoseDetection.minPoseConfidence);
          minPartConfidence
            = Number(this._params.multiPoseDetection.minPartConfidence);
          break;
        default:
          logger.warn(`Invalid input algorithm: ${this._params.algorithm}`);
      }
      return poses;
    }
  }

  const defaultFaceDetectorParams = {
    initialScale: 4,
    stepSize: 2,
    edgesDensity: 0.1,
  }

  class FaceDetector extends Detector {
    constructor(video = document.getElementById('video'), flipHorizontal=true) {
      super();

      this._flipHorizontal = flipHorizontal;
      this._tracker = new tracking.ObjectTracker('face');
      this._canvas = document.createElement('canvas');
      this._context = this._canvas.getContext('2d');

      this.setVideo(video);
      this.setParams(defaultFaceDetectorParams);
    }

    get _params() {
      return {
        edgesDensity: this._tracker.edgesDensity,
        initialScale: this._tracker.initialScale,
        scaleFactor: this._tracker.scaleFactor,
        stepSize: this._tracker.stepSize,
      }
    }

    set _params({
      edgesDensity = defaultFaceDetectorParams.edgesDensity,
      initialScale = defaultFaceDetectorParams.initialScale,
      scaleFactor = defaultFaceDetectorParams.scaleFactor,
      stepSize = defaultFaceDetectorParams.stepSize,
    } = {}) {
      this._tracker.setEdgesDensity(edgesDensity);
      this._tracker.setInitialScale(initialScale);
      this._tracker.setScaleFactor(scaleFactor);
      this._tracker.setStepSize(stepSize);
    }

    getParams() {
      return this._params;
    }

    setParams(params) {
      this._params = params;
      return this;
    }

    setVideo(video) {
      if (!video) {
        logger.warn('Invalid input video:', video);
        return this;
      };
      this._video = video;
      this._canvas.width = this._video.width;
      this._canvas.height = this._video.height;

      if (this._flipHorizontal) {
        this._context = this._canvas.getContext('2d');
        this._context.setTransform(1, 0, 0, 1, 0, 0);
        this._context.scale(-1, 1);
        this._context.translate(-this._video.width, 0);
      }
      return this;
    }

    async detect() {
      if (!this._video) {
        logger.warn('Skipping; no video input');
        return;
      };

      this._context.drawImage(
        this._video, 0, 0, this._video.width, this._video.height
      );
      return new Promise(resolve => {
        this._tracker.once('track', result => {
          resolve(result.data);
        });
        tracking.trackCanvasInternal_(this._canvas, this._tracker);
      });
    }
  }

  export const createDetector = (type) => {
    switch (type) {
      case 'pose':
        return new PoseDetector();
      case 'face':
        return new FaceDetector();
      default:
        logger.warn(`Returning null; unknown detector type: ${type}`);
        return null;
    }
  }

  export class DetectionAction {
    constructor(collection, id, video = document.getElementById('video'), detector = new PoseDetector()) {
      this._video = video;

      this._detectionId = Detections.findOne({actionId: id})._id;

      this._as = getActionServer(collection, id);
      this._as.registerGoalCallback(this.goalCB.bind(this));
      this._as.registerPreemptCallback(this.preemptCB.bind(this));

      this._timeoutId = null;

      this.setDetector(detector);
    }

    setVideo(video) {
      if (!video) {
        logger.warn('Invalid input video:', video);
        return this;
      };
      this._video = video;
      if (this._detector) this._detector.setVideo(this._video);
      return this;
    }

    setDetector(detector) {
      if (
        !(detector instanceof PoseDetector)
        && !(detector instanceof FaceDetector)
      ) {
        logger.warn('Invalid input detector:', detector);
        return this;
      };
      this._detector = detector;
      this._detector.setVideo(this._video);
      Detections.update(this._detectionId, {
        $set: {'data.params': this._detector.getParams()},
      });
      return this;
    }

    async goalCB({goal} = {}) {
      const fps = (goal.fps && goal.fps > 0) ? goal.fps : 10;
      const interval = 1000 / fps;
      let start = Date.now();
      this._timeoutId = {};
      const execute = async () => {
        const elapsed = Date.now() - start;
        if (elapsed > interval) {
          start = Date.now();
          Detections.update(this._detectionId, {
            $set: {
              'data.data': await this._detector.detect(),
              'data.params': goal.params
                ? this._detector.setParams(goal.params).getParams()
                : this._detector.getParams(),
            },
          });
          if (!this._timeoutId) return;
          this._timeoutId = setTimeout(execute, 0);
        } else {
          if (!this._timeoutId) return;
          this._timeoutId = setTimeout(execute, interval - elapsed);
        }
      }
      execute();
    }

    preemptCB() {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
      this._as.setPreempted();
    }
  }

}


if (Meteor.isServer) {
  Detections.allow({
    insert: (userId, doc) => {
      return false;
    },
    update: (userId, doc, fields, modifier) => {
      return true;
    },
    remove: (userId, doc) => {
      return true;
    },
    fetch: ['owner']
  });

  Meteor.publish('detections', function detectionsPublication() {
    return Detections.find({owner: this.userId});
  });

  Meteor.methods({
    'detections.insert'(owner, actionId) {
      check(owner, String);
      check(actionId, String);

      if (!Meteor.users.findOne(owner)) {
        throw new Meteor.Error('invalid-input', `Invalid owner: ${owner}`);
      }

      if (Detections.findOne({owner, actionId})) {
        logger.warn(`Skipping; user ${owner} already has a detection doc with "actionId: ${actionId}" field`);
        return;
      }

      Detections.insert(
        Object.assign({owner, actionId, type: '', data: {}}, defaultAction)
      );
    },

    'detections.remove'(owner) {
      if (this.userId || this.connection) {  // server-side call only
        throw new Meteor.Error('not-authorized');
      }

      Detections.remove({owner});
    }
  });
}
