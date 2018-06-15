import { Accounts } from 'meteor/accounts-base';

Accounts.config({
  forbidClientAccountCreation: Meteor.settings.public.accounts.forbidClientAccountCreation,
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
