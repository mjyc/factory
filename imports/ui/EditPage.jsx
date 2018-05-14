import 'codemirror/lib/codemirror.css';
import CodeMirror from 'react-codemirror';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PrivatePage from './PrivatePage.jsx'

// EdiPage component - represents the whole app for the edit page
export default class EditPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const value = `console.log('Hello World!');`
    const options = {
      lineNumbers: true
    };
    return (
      <PrivatePage>
        <div>
          <RaisedButton
            label="Log out"
            onClick={() => {
              Meteor.logout();
            }}
          />
          <div>
            <CodeMirror value={value} options={options} />
          </div>
          <div>
            <p>Robot face panel</p>
          </div>
        </div>
      </PrivatePage>
    );
  }
}
