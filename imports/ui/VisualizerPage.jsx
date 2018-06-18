import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { VisionViz, setupCamera } from 'meteor/mjyc:simple-face'
import PrivatePage from './PrivatePage.jsx'


class VisualizerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
    }
  }

  render() {
    const history = this.props.history;
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>
            <div>
              <video
                style={{display: 'none'}}
                ref={(element) => {
                  if (!this.state.video) {
                    setupCamera(element);
                    this.setState({video: element});
                  }
                }}
                width="600px"
                height="500px"
                autoPlay
              />
            </div>
            {this.props.currentUser && this.state.video ? (
              <div>
                <VisionViz
                  query={{owner: Meteor.userId()}}
                  video={this.state.video}
                />
              </div>
            ) : null}
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
})(VisualizerPage);
