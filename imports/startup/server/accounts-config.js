import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration'

Accounts.config({
  restrictCreationByEmailDomain: Meteor.settings.accounts.restrictCreationByEmailDomain,
});

Meteor.startup(() => {
  ServiceConfiguration.configurations.remove({
    service: 'google'
  });

  ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: Meteor.settings.googleAuth.clientId,
    secret: Meteor.settings.googleAuth.secret
  });
});
