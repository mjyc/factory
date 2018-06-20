import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { MediaFileManager } from 'meteor/mjyc:robot-face'
import PrivatePage from './PrivatePage.jsx'


// MediaFilesPage component - represents the whole app for the media files page
class MediaFilesPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PrivatePage
        loggingIn={this.props.loggingIn}
        currentUser={this.props.currentUser}
      >
        <MuiThemeProvider>
          <div>
            <MediaFileManager />
          </div>
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}

export default withTracker(() => {
  return {
    loggingIn: Meteor.loggingIn(),
    currentUser: Meteor.user(),
  };
})(MediaFilesPage);
