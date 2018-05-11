import 'codemirror/lib/codemirror.css';
import CodeMirror from 'react-codemirror';
import React from 'react';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
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
export default class EditApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const value = `console.log('Hello World!');`
    const options = {
      lineNumbers: true
    };
    return (
      <div>
        <CodeMirror value={value} options={options} />
      </div>
    );
  }
}
