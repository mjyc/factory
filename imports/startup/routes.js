Router.route('/', {
  template: 'home'
});

Router.route('/about', {
  template: 'aboutPage'
});

// import './program_templates.js';

// Router.route('programs_list', {
//   path: '/programs',
//   template: 'programs_list',
//   waitOn: function() {
//     const subs = [
//       Meteor.subscribe('new_programs'),
//     ];
//   },
// });

// Router.route('program_editor', {
//   path: '/program/:_id/edit',
//   template: 'program_editor',
//   waitOn: function() {
//     const subs = [
//       Meteor.subscribe('new_programs', { _id: this.params._id }),
//     ];
//   },
// });
