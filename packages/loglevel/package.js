Package.describe({
  name: 'mjyc:loglevel',
  version: '0.0.1',
  summary: 'Meteor package for pimterry\'s loglevel',
  git: 'https://github.com/mjyc/meteor-loglevel',
  documentation: 'README.md'
});

Npm.depends({
  'loglevel': '1.6.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6');
  api.use('ecmascript');
  api.mainModule('main.js');
});
