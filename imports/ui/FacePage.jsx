import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { SimpleFace, VisionViz } from 'meteor/mjyc:simple-face'
import PrivatePage from './PrivatePage.jsx'

class FacePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
    }
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <div>Loading...</div>
      )
    }

    const history = this.props.history;
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div style={{position: 'relative'}}>
            <SimpleFace
              query={{owner: this.props.currentUser._id}}
              setVideo={(video) => this.setState({video})}
            />
            <VisionViz
              style={{
                bottom: 0,
                position: 'absolute',
              }}
              query={{owner: this.props.currentUser._id}}
              video={this.state.video}
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
