import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Programs = new Mongo.Collection('programs');

if (Meteor.isServer) {
  Meteor.publish('programs', function programsPublication() {
    return Programs.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });

  Meteor.methods({
    'programs.insert'() {
      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Programs.insert({
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },

    'programs.remove'(programId) {
      check(programId, String);

      const program = Programs.findOne(programId);
      // TODO: consider supporting "private" programs
      if (program.owner !== this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Programs.remove(programId);
    },
  });
}
