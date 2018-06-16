import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';
import { Actions } from 'meteor/mjyc:action';

const logger = log.getLogger('fixtures');
const obj2str = (obj) => { return util.inspect(obj, true, null, true); }


const actionTypes = [
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

// Add and remove actions on user creation and deletion
Meteor.users.find().observeChanges({

  added: (owner, fields) => {
    logger.debug(`[Meteor.users.find().observeChanges added] id: ${owner}, fields: ${obj2str(fields)}`);

    actionTypes.map((type) => {
      Meteor.call('actions.insert', owner, type);
    });

    Meteor.call('speechbubbles.insert', owner, Actions.findOne({owner, type: 'speechbubbleRobot'})._id);
    Meteor.call('speechbubbles.insert', owner, Actions.findOne({owner, type: 'speechbubbleHuman'})._id);

    Meteor.call('detections.insert', owner, Actions.findOne({owner, type: 'poseDetection'})._id);
    Meteor.call('detections.insert', owner, Actions.findOne({owner, type: 'faceDetection'})._id);
  },

  removed: (owner) => {
    logger.debug(`[Meteor.users.find().observeChanges removed] id: ${owner}`);

    actionTypes.map((collection) => {
      Meteor.call('actions.remove', owner);
    });

    Meteor.call('speechbubbles.remove', owner);
    Meteor.call('speechbubbles.remove', owner);

    Meteor.call('detections.remove', owner);
    Meteor.call('detections.remove', owner);
  }

})
