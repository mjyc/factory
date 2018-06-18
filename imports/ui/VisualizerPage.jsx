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

    this.elements = {}
  }

  componentDidMount() {
    console.log('1111');
    setupCamera(this.elements.video);
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
                ref={(element) => { console.log('------'); this.elements['video'] = element; }}
                width="600px"
                height="500px"
                autoPlay
              />
            </div>
            {this.props.currentUser && this.elements ? (
              <div>
                <VisionViz
                  query={{owner: this.props.currentUser._id}}
                  video={this.elements.video}
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
