import util from 'util';
import * as log from 'loglevel';  // TODO: figure out why loglevel is not working
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import {
  Speechbubbles,
  DisplayMessageAction,
  AskMultipleChoiceAction,
} from 'meteor/simple-face'
import { Programs } from './programs.js'

const logger = log.getLogger('program_executor');

const obj2str = (obj) => { return util.inspect(obj, true, null, true); }

if (Meteor.isServer) {

  const promisifyEmitter = (emitter) => {
    return new Promise((resolve, reject) => {
      emitter.on('done', resolve);
    });
  }

  // TODO: consider creating
  const getSpeechbubbleActions = ({userId = ''} = {}) => {
    const speechbubbleRobot = Speechbubbles.findOne({owner: userId, role: 'robot'});
    const speechbubbleHuman = Speechbubbles.findOne({owner: userId, role: 'human'});

    return {
      displayMessageLeft: new DisplayMessageAction({speechbubbleId: speechbubbleRobot._id}),
      displayMessageRight: new DisplayMessageAction({speechbubbleId: speechbubbleHuman._id}),
      askMultipleChoiceLeft: new AskMultipleChoiceAction({speechbubbleId: speechbubbleHuman._id}),
      askMultipleChoiceRight: new AskMultipleChoiceAction({speechbubbleId: speechbubbleHuman._id}),
    }
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