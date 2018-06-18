import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { SimpleFace } from 'meteor/mjyc:simple-face'
import PrivatePage from './PrivatePage.jsx'

class FacePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const history = this.props.history;
    return (
      <PrivatePage>
        <MuiThemeProvider>
          {this.props.currentUser ? (
            <div>
              <SimpleFace
                query={{owner: this.props.currentUser._id}}
              />
            </div>
          ) : null}
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}

export default withTracker(({match}) => {
  const currentUser = Meteor.user();

  return {
    currentUser
  };
})(FacePage);
