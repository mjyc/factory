import 'codemirror/lib/codemirror.css';
import CodeMirror from 'react-codemirror';
import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

// MainApp component - represents the whole app for the edit page
export default class EditApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('EditApp', this.props);

    const value = `console.log('Hello World!');`
    const options = {
      lineNumbers: true
    };
    return (
      <div>
        <div>
        <CodeMirror value={value} options={options} />
        </div>
        <div>
          <p>Robot face panel</p>
        </div>
      </div>
    );
  }
}
