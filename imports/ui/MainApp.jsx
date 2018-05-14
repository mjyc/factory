import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import PrivatePage from './PrivatePage.jsx'

// MainApp component - represents the whole app for the main page
export default class MainApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('MainApp', this.props);

    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>
          <RaisedButton
            label="logout"
            onClick={(ev) => {
              Meteor.logout();
            }}
          />
          <Table
            fixedHeader={true}
            selectable={false}
            style={{ margin: 0 }}
          >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
            >
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Title</TableHeaderColumn>
                <TableHeaderColumn>Last modified</TableHeaderColumn>
                <TableHeaderColumn>Options</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                  <TableRow key={'program._id'} >
                    <TableRowColumn>{'program._id'}</TableRowColumn>
                    <TableRowColumn>{'program.title'}</TableRowColumn>
                    <TableRowColumn>
                    {'time'}
                    </TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton
                        label="Edit"
                      />
                      <RaisedButton
                        label="Delete"
                      />
                    </TableRowColumn>
                  </TableRow>
            </TableBody>
          </Table>
          </div>
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}
