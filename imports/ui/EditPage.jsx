import 'codemirror/lib/codemirror.css';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PrivatePage from './PrivatePage.jsx'
import { Programs } from '../api/programs.js'

// EdiPage component - represents the whole app for the edit page
class EditPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const value = `console.log('Hello World!');`
    const options = {
      lineNumbers: true
    };

    if (this.props.loading) {
      return (
        <div>Logging in...</div>
      )
    }

    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>
            <RaisedButton
              label="Back"
              onClick={() => {
                console.log('redirect home');
              }}
            />
            <RaisedButton
              label="Run"
              onClick={() => {
                console.log('run code');
              }}
            />
            <RaisedButton
              label="Log out"
              onClick={() => {
                Meteor.logout();
              }}
            />
            <div>
              <TextField
                value={this.props.program.title}
                floatingLabelText='title'
              />
            </div>
            <div>
              <CodeMirror value={value} options={options} />
            </div>
            <div>
              <p>Render robot face here</p>
            </div>
          </div>
        </MuiThemeProvider>
      </PrivatePage>
    );
  }
}

export default withTracker(({match}) => {
  const programsHandle = Meteor.subscribe('programs', match.params.id);
  const loading = !programsHandle.ready();
  const program = Programs.findOne();

  return {
    loading,
    program,
  };
})(EditPage);
