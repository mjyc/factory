import log from 'meteor/mjyc:loglevel';
import util from 'util';
import { Meteor } from 'meteor/meteor';

import {
  Speechbubbles,
  Speech,
  MediaActions,
  VisionActions,
  FacialExpressionActions,
} from 'meteor/mjyc:simple-face';

const logger = log.getLogger('fixtures');
const obj2str = (obj) => { return util.inspect(obj, true, null, true); }



// Add and remove actions on user creation and deletion
Meteor.users.find().observeChanges({

  added: (id, fields) => {
    logger.debug(`[Meteor.users.find().observeChanges added] id: ${id}, fields: ${obj2str(fields)}`);

    Meteor.call('speechbubbles.addUser', id);
    Meteor.call('speech_actions.addUser', id);
    Meteor.call('media_actions.addUser', id);
    Meteor.call('vision_actions.addUser', id);
    Meteor.call('facial_expression_actions.addUser', id);
  },

  removed: (id) => {
    logger.debug(`[Meteor.users.find().observeChanges removed] id: ${id}`);

    // TODO: use Meteor method instead; need to remove more docs than as is
    [Speechbubbles, Speech, MediaActions, VisionActions, FacialExpressionActions].map((collection) => {
      collection.remove({owner: id});
    });
  }

})
