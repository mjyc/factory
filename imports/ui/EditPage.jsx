import log from 'meteor/mjyc:loglevel';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Programs } from '../api/programs.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import {
  SimpleFace,
  VisionViz,
} from 'meteor/mjyc:simple-face'
import PrivatePage from './PrivatePage.jsx'

const logger = log.getLogger('EditPage');

// EdiPage component - represents the whole app for the edit page
class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
    }
  }

  render() {
    if (this.props.loading) {
      return (
        <div>Loading...</div>
      )
    }

    const history = this.props.history;
    const options = {
      lineNumbers: true,
      mode: 'javascript',
    };
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
                label="Run"
                onClick={() => {
                  logger.log(`run: ${this.props.program.code}`);
                  Meteor.call('program_executor.run', this.props.program.code);
                }}
              />
              <RaisedButton
                label="Log out"
                onClick={() => {
                  Meteor.logout();
                }}
              />
            </div>
            <div>
              <TextField
                value={this.props.program.name}
                floatingLabelText='name'
                onChange={(event, value) => {
                  Meteor.call('programs.setName', this.props.program._id, value);
                }}
              />
            </div>
            <div>
              <CodeMirror
                value={this.props.program.code}
                options={options}
                onChange={(value) => {
                  Meteor.call('programs.setCode', this.props.program._id, value);
                }}
              />
            </div>
            <div>
              <SimpleFace
                query={{owner: Meteor.userId()}}
                setVideo={(video) => this.setState({video})}
              />
            </div>
            <div>
              <VisionViz
                detectionQuery={{owner: Meteor.userId()}}
                video={this.state.video}
              />
            </div>
          </div>
        </MuiThemeProvider>
      </PrivatePage>
    );
  }
}

export default withTracker(({match}) => {
  const programsHandle = Meteor.subscribe('programs', match.params.id);
  const loading = !programsHandle.ready();
  const program = Programs.findOne();

  return {
    loading,
    program,
  };
})(EditPage);
