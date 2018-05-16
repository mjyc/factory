import 'codemirror/lib/codemirror.css';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { Meteor } from 'meteor/meteor';
import PrivatePage from './PrivatePage.jsx'

// EdiPage component - represents the whole app for the edit page
export default class EditPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const value = `console.log('Hello World!');`
    const options = {
      lineNumbers: true
    };
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>
            <RaisedButton
              label="Log out"
              onClick={() => {
                Meteor.logout();
              }}
            />
            <RaisedButton
              label="Run"
              onClick={() => {
                console.log('run code');
              }}
            />
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
