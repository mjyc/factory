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
    return Programs.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    })
  });

  Meteor.methods({
    'programs.insert'(name = '', code = '') {
      check(name, String);
      check(code, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Programs.insert({
        name,
        code,
        private: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
  });
}
