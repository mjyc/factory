import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Actions, getActionClient } from 'meteor/mjyc:action';

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
        return getActionClient(Actions, Actions.findOne({owner, type})._id);
      });

      logger.debug(`executing code: ${code}`);
      Meteor.defer(() => {
        logger.info(`result = ${obj2str(eval(code))}`);
      })
    },
  });
}
