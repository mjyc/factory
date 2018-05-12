import { Meteor } from 'meteor/meteor';
import { configureAccounts } from '../imports/startup/server/accounts-config.js';

Meteor.startup(() => {
  // code to run on server at startup
  configureAccounts();
});
