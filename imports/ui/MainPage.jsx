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
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PrivatePage from './PrivatePage.jsx'
import { Programs } from '../api/programs.js'

// MainPage component - represents the whole app for the main page
class MainPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>
          <RaisedButton
            label="Log out"
            onClick={() => {
              Meteor.logout();
            }}
          />
          <RaisedButton
            label="New"
            onClick={() => {
              Meteor.call('programs.insert');
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
            {
              this.props.programs.map((program) => {
                return (
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
                );
              })
            }
            </TableBody>
          </Table>
          </div>
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}

export default withTracker(() => {
  // const facesHandle = Meteor.subscribe('faces', faceQuery);
  // const loading = !facesHandle.ready();
  // const face = Faces.findOne();
  Meteor.subscribe('programs');

  return {
    programs: Programs.find().fetch(),
  };
})(MainPage);
