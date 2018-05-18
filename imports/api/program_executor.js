import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { Speechbubbles } from 'meteor/simple-face'
import { Programs } from './programs.js'

if (Meteor.isServer) {
  Meteor.methods({
    'program_executor.run'(code) {

      const robotSpeechBubbleId = Speechbubbles.findOne({owner: this.userId, role: 'robot'})._id;
      const humanSpeechBubbleId = Speechbubbles.findOne({owner: this.userId, role: 'human'})._id;

      // const displayMessage = (message, callback) => {
      //   Meteor.call('speechbubbles.displayMessage', robotSpeechBubbleId, message, callback);
      //   Meteor.call('speechbubbles.displayMessage', humanSpeechBubbleId, '', callback);
      // }
      // const askMultipleChoice = (message, choices, callback) => {
      //   const id = Speechbubbles.findOne({owner: this.userId, role: 'robot'})._id;
      //   Meteor.call('speechbubbles.displayMessage', robotSpeechBubbleId, message, () => {});
      //   Meteor.call('speechbubbles.askMultipleChoice', humanSpeechBubbleId, choices, callback);
      // }
      // const askMultipleChoiceSync = (message, choices) => {
      //   const id = Speechbubbles.findOne({owner: this.userId, role: 'robot'})._id;
      //   Meteor.call('speechbubbles.displayMessage', robotSpeechBubbleId, message, () => {});
      //   return Meteor.call('speechbubbles.askMultipleChoice', humanSpeechBubbleId, choices);
      // }
      // const sleep = (sec) => { Meteor._sleepForMs(sec * 1000); }

      // console.log('executing code: ', code);
      Meteor.defer(() => {

        // console.log('returned', eval(code));
      })
    }
  });
}
