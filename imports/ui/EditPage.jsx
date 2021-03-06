import log from 'meteor/mjyc:loglevel';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Programs } from '../api/programs.js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import {
  RobotFace,
  VisionViz,
} from 'meteor/mjyc:robot-face'
import PrivatePage from './PrivatePage.jsx'

const logger = log.getLogger('EditPage');


// EdiPage component - represents the whole app for the edit page
class EditPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const history = this.props.history;
    const options = {
      lineNumbers: true,
      mode: 'javascript',
    };
    return (
      <PrivatePage
        loggingIn={this.props.loggingIn}
        currentUser={this.props.currentUser}
      >
        <MuiThemeProvider>
          {!this.props.loading ? (
          <div>
            <div>
              <RaisedButton
                label="Face"
                labelPosition="before"
                onClick={() => {
                  window.open('/face');
                }}
                icon={<OpenInNew />}
              />
            </div>
            <div>
              <RaisedButton
                label="Run"
                onClick={() => {
                  logger.log(`run: ${this.props.program.code}`);
                  Meteor.call('program_executor.run', this.props.program.code);
                }}
              />
            </div>
            <div>
              <TextField
                defaultValue={this.props.program.name}
                floatingLabelText='name'
                onChange={(event, value) => {
                  Programs.update(this.props.program._id, {$set: {name: value}});
                }}
              />
            </div>
            <div>
              <CodeMirror
                value={this.props.program.code}
                options={options}
                onChange={(value) => {
                  Programs.update(this.props.program._id, {$set: {code: value}});
                }}
              />
            </div>
          </div>
          ) : null}
        </MuiThemeProvider>
      </PrivatePage>
    );
  }
}

export default withTracker(({match}) => {
  const programsHandle = Meteor.subscribe('programs', match.params.id);

  return {
    loggingIn: Meteor.loggingIn(),
    currentUser: Meteor.user(),
    loading: !programsHandle.ready(),
    program: Programs.findOne(),
  };
})(EditPage);
