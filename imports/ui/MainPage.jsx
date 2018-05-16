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
            label="New"
            onClick={() => {
              Meteor.call('programs.insert', 'Untitled');
            }}
          />
          <RaisedButton
            label="Log out"
            onClick={() => {
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
            {
              this.props.programs.map((program) => {
                return (
                  <TableRow key={program._id} >
                    <TableRowColumn>{program._id}</TableRowColumn>
                    <TableRowColumn>{program.title}</TableRowColumn>
                    <TableRowColumn>
                    {
                      // slice off a name of the day, e.g. 'Mon'
                      program.updatedAt.toDateString().slice(4)
                    }
                    </TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton
                        label="Edit"
                      />
                      <RaisedButton
                        label="Delete"
                        onClick={() => {
                          Meteor.call('programs.remove', program._id);
                        }}
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
  const programsHandle = Meteor.subscribe('programs');
  const loading = !programsHandle.ready();
  const programs = Programs.find().fetch();

  return {
    loading,
    programs,
  };
})(MainPage);
