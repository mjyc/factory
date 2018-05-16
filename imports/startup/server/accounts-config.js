import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration'

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
