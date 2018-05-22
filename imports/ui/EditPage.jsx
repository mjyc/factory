import log from 'meteor/mjyc:loglevel';
import 'codemirror/lib/codemirror.css';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { SimpleFace } from 'meteor/simple-face'
import PrivatePage from './PrivatePage.jsx'
import { Programs } from '../api/programs.js'

const logger = log.getLogger('EditPage');

// EdiPage component - represents the whole app for the edit page
class EditPage extends Component {
  constructor(props) {
    super(props);
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
              <SimpleFace faceQuery={{owner: Meteor.userId()}} />
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
