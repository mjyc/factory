import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { MediaFileManager } from 'meteor/mjyc:simple-face'
import PrivatePage from './PrivatePage.jsx'

// SettingsPage component - represents the whole app for the main page
export default class SettingsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const history = this.props.history;
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>

            <div>
              <RaisedButton
                label="Home"
                onClick={() => {
                  history.push('/');
                }}
              />
              <RaisedButton
                label="Log out"
                onClick={() => {
                  Meteor.logout();
                }}
              />
            </div>

            <h3>Media file manager</h3>
            <MediaFileManager />

          </div>
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}
