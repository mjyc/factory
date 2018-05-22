import util from 'util';
import * as log from 'loglevel';
import { Meteor } from 'meteor/meteor';

const logger = log.getLogger('fixtures');

const obj2str = (obj) => { return util.inspect(obj, true, null, true); }

// Set logger levels
if (Meteor.settings.logging) {
  const logging = Meteor.settings.logging;
  if (logging.default) log.setDefaultLevel(logging.default);
  if (logging.levels) {
    for (let name in logging.levels) {
      log.getLogger(name).setLevel(logging.levels[name]);
    }
  }
}

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
