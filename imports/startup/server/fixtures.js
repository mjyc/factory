import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';
import { Actions } from 'meteor/mjyc:action';

const logger = log.getLogger('fixtures');
const obj2str = (obj) => { return util.inspect(obj, true, null, true); }


// Add and remove actions on user creation and deletion
Meteor.users.find().observeChanges({

  added: (id, fields) => {
    logger.debug(`[Meteor.users.find().observeChanges added] id: ${id}, fields: ${obj2str(fields)}`);

    Meteor.call('actions.insert', id, 'facialExpression');
    Meteor.call('actions.insert', id, 'soundPlay');
    Meteor.call('actions.insert', id, 'speechSynthesis');
    Meteor.call('actions.insert', id, 'speechRecognition');
    Meteor.call('actions.insert', id, 'speechbubbleRobot');
    Meteor.call('actions.insert', id, 'speechbubbleHuman');
    Meteor.call('actions.insert', id, 'videoControl');
    Meteor.call('actions.insert', id, 'poseDetection');
    Meteor.call('actions.insert', id, 'faceDetection');

    Meteor.call('speechbubbles.insert', id, Actions.findOne({owner: id, type: 'speechbubbleRobot'})._id);
    Meteor.call('speechbubbles.insert', id, Actions.findOne({owner: id, type: 'speechbubbleHuman'})._id);

    Meteor.call('detections.insert', id, Actions.findOne({owner: id, type: 'poseDetection'})._id);
    Meteor.call('detections.insert', id, Actions.findOne({owner: id, type: 'faceDetection'})._id);
  },

  removed: (id) => {
    logger.debug(`[Meteor.users.find().observeChanges removed] id: ${id}`);

    // TODO: use Meteor method instead; need to remove more docs than as is
    // [].map((collection) => {
    //   collection.remove({owner: id});
    // });
  }

})
