import { Meteor } from 'meteor/meteor';
import {
  defaultAction,
  Speechbubbles,
  Speech,
} from 'meteor/simple-face';


// Insert defaultAction to action collections on user creation

const actionCollections = [
  Speechbubbles,
  Speech,
];

Meteor.users.after.insert(function(userId, doc) {
  actionCollections.map((collection) => {
    collection.insert(Object.assign({owner: this._id}, defaultAction));
  });
});
