import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Programs } from './programs.js'

const logger = log.getLogger('program_executor');
const obj2str = (obj) => { return util.inspect(obj, true, null, true); }


if (Meteor.isServer) {

  // TODO: update this
  const getSpeechbubbleActions = ({userId = ''} = {}) => {
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
    },
  });
}
