import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Programs = new Mongo.Collection('programs');

if (Meteor.isServer) {
  Programs.allow({
    insert: (userId, doc) => {
      return false;
    },
    update: (userId, doc, fields, modifier) => {
      return userId && doc.owner === userId;
    },
    remove: (userId, doc) => {
      return userId && doc.owner === userId;
    },
    fetch: ['owner']
  });

  Meteor.publish('programs', function programsPublication(id) {
    const query = {
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    };
    if (id) query._id = id;
    return Programs.find(query)
  });

  Meteor.methods({
    'programs.insert'(name = '', code = '') {
      check(name, String);
      check(code, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      const currentUser = Meteor.users.findOne(this.userId);
      Programs.insert({
        name,
        code,
        private: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: this.userId,
        username: currentUser.username || currentUser.profile.name,
      });
    },
  });
}
