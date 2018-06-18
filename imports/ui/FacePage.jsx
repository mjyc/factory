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
    if (!this.props.currentUser) {
      return null;
    }

    const history = this.props.history;
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>
            <SimpleFace
              query={{owner: this.props.currentUser._id}}
            />
          </div>
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
