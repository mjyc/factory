import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

// import { SpeechbubbleAction } from '../api/speechbubbles.js';
// import { SpeechActions } from '../api/speech.js';
// import { MediaActions } from '../api/media.js';
// import { FacialExpressionActions } from '../api/facial_expression.js';
// import { VisionActions } from '../api/vision.js';

import { Programs } from './programs.js'

const logger = log.getLogger('program_executor');
const obj2str = (obj) => { return util.inspect(obj, true, null, true); }

if (Meteor.isServer) {

  const promisifyEmitter = (emitter) => {
    return new Promise((resolve, reject) => {
      emitter.on('done', resolve);
    });
  }

  // TODO: update this
  const getSpeechbubbleActions = ({userId = ''} = {}) => {
    const actions = {
      'robot': Speechbubbles.findOne({owner: userId, role: 'robot'}),
      'human': Speechbubbles.findOne({owner: userId, role: 'human'}),
      'synthesis': SpeechActions.findOne({owner: userId, type: 'synthesis'}),
      'recognition': SpeechActions.findOne({owner: userId, type: 'recognition'}),
      'sound': MediaActions.findOne({owner: userId}),
      'eyes': FacialExpressionActions.findOne({owner: userId}),
      'video': VisionActions.findOne({owner: userId, type: 'video_control'}),
      'face': VisionActions.findOne({owner: userId, type: 'pose_detection'}),
      'pose': VisionActions.findOne({owner: userId, type: 'face_detection'}),
    };

    const actionClients = {
      'robot': getActionClient(Speechbubbles, actions.robot._id),
      'human': getActionClient(Speechbubbles, actions.human._id),
    }

    // class Robot {


    // }

    // const robot = {

    //   displayMessage: () => {
    //     actionClient.robot.sendGoal();
    //     return actionClient;
    //   }

    //   async waitForAllActionResults: () => {
    //     new Error('Not implemented');
    //   }

    //   async waitForOneActionResult: () => {
    //     new Error('Not implemented');
    //   }

    //   cancelAllActions: () => {
    //     new Error('Not implemented');
    //   }
    // }

    return {
      displayMessageLeft: null,
      displayMessageRight: null,
      askMultipleChoiceLeft: null,
      askMultipleChoiceRight: null,
    };
  }

  Meteor.methods({
    'program_executor.run'(code) {
      (
        {
          displayMessageLeft,
          displayMessageRight,
          askMultipleChoiceLeft,
          askMultipleChoiceRight,
        } = getSpeechbubbleActions({userId: this.userId})
      )

      logger.debug(`executing code: ${code}`);
      Meteor.defer(() => {
        logger.info(`result = ${obj2str(eval(code))}`);
      })
    }
  });
}
