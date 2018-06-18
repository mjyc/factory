import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { MediaFileManager } from 'meteor/mjyc:robot-face'
import PrivatePage from './PrivatePage.jsx'

// MediaFilesPage component - represents the whole app for the media files page
export default class MediaFilesPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>
            <MediaFileManager />
          </div>
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}
