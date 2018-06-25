import * as log from 'loglevel';

const settings = Meteor.isServer ? Meteor.settings.loglevel : Meteor.settings.public.loglevel;
if (settings) {
  if (settings.default) log.setDefaultLevel(settings.default);
  if (settings.levels) {
    for (let name in settings.levels) {
      log.getLogger(name).setLevel(settings.levels[name]);
    }
  }
}

export default log;
