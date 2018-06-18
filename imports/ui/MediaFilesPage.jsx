import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { MediaFileManager } from 'meteor/mjyc:simple-face'
import PrivatePage from './PrivatePage.jsx'

// MediaFilesPage component - represents the whole app for the media files page
export default class MediaFilesPage extends Component {
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

            <MediaFileManager />

          </div>
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}
