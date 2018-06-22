import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Actions, getActionClient } from 'meteor/mjyc:action';
import { Detections } from 'meteor/mjyc:robot-face'

import { Programs } from './programs.js'

const logger = log.getLogger('program_executor');
const obj2str = (obj) => { return util.inspect(obj, true, null, true); }


if (Meteor.isServer) {
  Meteor.methods({
    // TODO: make sure one can run multiple programs in parallel!
    'program_executor.run'(code) {
      const owner = this.userId;
      [
        eyeExpression,
        soundPlay,
        speechSynthesis,
        speechRecognition,
        speechbubbleRobot,
        speechbubbleHuman,
        videoControl,
        poseDetection,
        faceDetection,
      ] = [
        'eyeExpression',
        'soundPlay',
        'speechSynthesis',
        'speechRecognition',
        'speechbubbleRobot',
        'speechbubbleHuman',
        'videoControl',
        'poseDetection',
        'faceDetection',
      ].map(type => {
        const actionClient = getActionClient(Actions, Actions.findOne({owner, type})._id);
        Promise.await(actionClient.cancelGoal());
        return actionClient;
      });

      logger.debug(`executing code: ${code}`);
      Meteor.defer(() => {
        let exitcode;
        try {
          exitcode = eval(code);
        } catch (err) {
          logger.warn('code threw an error', err);
          exitcode = 1;
        }
        logger.info('code finished with exitcode', exitcode);

        [
          eyeExpression,
          soundPlay,
          speechSynthesis,
          speechRecognition,
          speechbubbleRobot,
          speechbubbleHuman,
          videoControl,
          poseDetection,
          faceDetection,
        ].map((action) => {
          action.cancelGoal();
        });
        videoControl.sendGoal({type: 'stop'});
        speechbubbleRobot.sendGoal({type: '', data: {}});
        speechbubbleHuman.sendGoal({type: '', data: {}});
      })
    },
  });
}
