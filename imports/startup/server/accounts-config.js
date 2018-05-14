export const configureAccounts = () => {
  ServiceConfiguration.configurations.remove({
    service: 'google'
  });

  ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: Meteor.settings.googleAuth.clientId,
    secret: Meteor.settings.googleAuth.secret
  });
}
