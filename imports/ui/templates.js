import { Template } from 'meteor/templating';
import './templates.html';
import MainApp from './MainApp.jsx';
import EditApp from './EditApp.jsx';

Template.main.helpers({
  MainAppContainer() {
    return MainApp;
  }
});

Template.edit.helpers({
  EditAppContainer() {
    return EditApp;
  }
});
