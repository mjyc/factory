import util from 'util';
import log from 'meteor/mjyc:loglevel';
import { Meteor } from 'meteor/meteor';

const logger = log.getLogger('fixtures');

const obj2str = (obj) => { return util.inspect(obj, true, null, true); }


import {
  Speechbubbles,
  Speech,
} from 'meteor/simple-face';

// Add and remove actions on user creation and deletion
Meteor.users.find().observeChanges({

  added: (id, fields) => {
    logger.debug(`[Meteor.users.find().observeChanges added] id: ${id}, fields: ${obj2str(fields)}`);

    Meteor.call('speechbubbles.initialize', id);
    Meteor.call('speech.addUser', id);
  },

  removed: (id) => {
    logger.debug(`[Meteor.users.find().observeChanges removed] id: ${id}`);

    // TODO: use Meteor method instead
    [Speechbubbles, Speech].map((collection) => {
      collection.remove({owner: id});
    });
  }

})
