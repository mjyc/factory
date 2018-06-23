import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { RobotFace } from 'meteor/mjyc:robot-face'
import PrivatePage from './PrivatePage.jsx'


class FacePage extends Component {
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
            {this.props.currentUser ? (
            <RobotFace
              query={{owner: this.props.currentUser._id}}
            />
            ) : null}
          </div>
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}

export default withTracker(({match}) => {
  return {
    loggingIn: Meteor.loggingIn(),
    currentUser: Meteor.user(),
  };
})(FacePage);
