import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Actions, getActionClient } from 'meteor/mjyc:action';

import { Programs } from './programs.js'

const logger = log.getLogger('program_executor');
const obj2str = (obj) => { return util.inspect(obj, true, null, true); }


if (Meteor.isServer) {

  class Robot {
    constructor(owner) {
      this._actionTypes = [
        'eyeExpression',
        'soundPlay',
        'speechSynthesis',
        'speechRecognition',
        'speechbubbleRobot',
        'speechbubbleHuman',
        'videoControl',
        'poseDetection',
        'faceDetection',
      ];

      this._acs = {};
      this._actionTypes.map((type) => {
        this._acs[type] = getActionClient(Actions, Actions.findOne({owner, type})._id);
      });
    }

    async makeEyeExpression(type = 'happy', duration = 1000) {
      await this._acs.eyeExpression.sendGoal({type, duration});
      return this._acs.eyeExpression;
    }

    async playSound(name = '') {
      await this._acs.soundPlay.sendGoal({name});
      return this._acs.soundPlay;
    }

    async say(text = '') {
      await this._acs.speechSynthesis.sendGoal({text});
      return this._acs.speechSynthesis;
    }

    async listen() {
      await this._acs.speechRecognition.sendGoal();
      return this._acs.speechRecognition;
    }

    async displayMessage(message = '') {
      await this._acs.speechbubbleRobot.sendGoal({
        type: 'message',
        data: {message}
      });
      return this._acs.speechbubbleRobot;
    }

    async askMultipleChoice(choices = []) {
      await this._acs.speechbubbleHuman.sendGoal({
        type: 'choices',
        data: {choices}
      });
      return this._acs.speechbubbleRobot;
    }

    async startVideo() {
      await this._acs.videoControl.sendGoal({type: 'play'});
      return this._acs.videoControl;
    }

    async stopVideo() {
      await this._acs.videoControl.sendGoal({type: 'stop'});
      return this._acs.videoControl;
    }

    async detectPose(fps = 10) {
      await this._acs.poseDetection.sendGoal({fps});
      return this._acs.poseDetection;
    }

    async detectFace(fps = 10) {
      await this._acs.faceDetection.sendGoal({fps});
      return this._acs.faceDetection;
    }
  }

  Meteor.methods({
    // TODO: make sure it can only run one program at a time
    'program_executor.run'(code) {
      const robot = new Robot(this.userId);

      logger.debug(`executing code: ${code}`);
      Meteor.defer(async () => {
        logger.info(`result = ${obj2str(eval(code))}`);
      })
    },
  });
}
