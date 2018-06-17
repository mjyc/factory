import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Programs } from '../api/programs.js'

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
import Toggle from 'material-ui/Toggle';
import PrivatePage from './PrivatePage.jsx'

// MainPage component - represents the whole app for the main page
class MainPage extends Component {
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
    return (
      <PrivatePage>
        <MuiThemeProvider>
          <div>

            <div>
              <RaisedButton
                label="New"
                onClick={() => {
                  Meteor.call('programs.insert', 'Untitled');
                }}
              />
              <RaisedButton
                label="Settings"
                onClick={() => {
                  history.push('/settings');
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
              <h3>Your Programs</h3>
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
                  this.props.programs.filter((program) => {return program.owner === Meteor.user()._id}).map((program) => {
                    return (
                      <TableRow key={program._id} >
                        <TableRowColumn>{program._id}</TableRowColumn>
                        <TableRowColumn>{program.name}</TableRowColumn>
                        <TableRowColumn>
                        {
                          // slice off a name of the day, e.g. 'Mon'
                          program.updatedAt.toDateString().slice(4)
                        }
                        </TableRowColumn>
                        <TableRowColumn>
                          <Toggle
                            label="Private"
                            labelPosition="right"
                            onToggle={(event, isInputChecked) => {
                              Meteor.call('programs.setPrivate', program._id, isInputChecked);
                            }}
                          />
                          <RaisedButton
                            label="Edit"
                            onClick={() => {
                              history.push(`/programs/${program._id}`);
                            }}
                          />
                          <RaisedButton
                            label="Delete"
                            onClick={function() {
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

            <div>
              <h3>Public Programs</h3>
              <Table
                fixedHeader={true}
                selectable={false}
                style={{margin: 0}}
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
                  this.props.programs.filter((program) => {return program.owner !== Meteor.user()._id}).map((program) => {
                    return (
                      <TableRow key={program._id} >
                        <TableRowColumn>{program._id}</TableRowColumn>
                        <TableRowColumn>{program.name}</TableRowColumn>
                        <TableRowColumn>
                        {
                          // slice off a name of the day, e.g. 'Mon'
                          program.updatedAt.toDateString().slice(4)
                        }
                        </TableRowColumn>
                        <TableRowColumn>
                          <RaisedButton
                            label="Edit"
                            onClick={() => {
                              history.push(`/programs/${program._id}`);
                            }}
                          />
                          <RaisedButton
                            label="Delete"
                            onClick={function() {
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
