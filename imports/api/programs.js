import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Programs = new Mongo.Collection('programs');

if (Meteor.isServer) {
  Meteor.publish('programs', function programsPublication(id) {
    // TODO: consider supporting "private" programs
    const query = {owner: this.userId};
    if (id) { query._id = id; }
    return Programs.find(query);
  });

  Meteor.methods({
    'programs.insert'(name = '') {
      check(name, String);

      if (!this.userId) {
        throw new Meteor.Error('not-authorized');
      }

      Programs.insert({
        name: name,
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
