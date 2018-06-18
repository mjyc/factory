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
import Checkbox from 'material-ui/Checkbox';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import PrivatePage from './PrivatePage.jsx'


// MainPage component - represents the whole app for the main page
class MainPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PrivatePage
        loggingIn={this.props.loggingIn}
        currentUser={this.props.currentUser}
      >
        <MuiThemeProvider>
          {!this.props.loading && this.props.currentUser ? (
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
              <RaisedButton
                label="Media Files"
                labelPosition="before"
                onClick={() => {
                  window.open('/media_files');
                }}
                icon={<OpenInNew />}
              />
              <RaisedButton
                label="Log out"
                onClick={() => {
                  Meteor.logout();
                }}
              />
            </div>

            <div>
              <RaisedButton
                label="New"
                onClick={() => {
                  Meteor.call('programs.insert', 'Untitled');
                }}
              />
            </div>

            <div>
              <h3>Your Programs</h3>
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
                    <TableHeaderColumn>Owner</TableHeaderColumn>
                    <TableHeaderColumn>Last modified</TableHeaderColumn>
                    <TableHeaderColumn>Private</TableHeaderColumn>
                    <TableHeaderColumn>Options</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                {
                  this.props.programs.filter((program) => {
                    return program.owner === this.props.currentUser._id;
                  }).map((program) => {
                    return (
                      <TableRow key={program._id} >
                        <TableRowColumn>{program._id}</TableRowColumn>
                        <TableRowColumn>{program.name}</TableRowColumn>
                        <TableRowColumn>{program.username}</TableRowColumn>
                        <TableRowColumn>
                        {
                          // slice off a name of the day, e.g. 'Mon'
                          program.updatedAt.toDateString().slice(4)
                        }
                        </TableRowColumn>
                        <TableRowColumn>
                          <Checkbox
                            checked={program.private}
                            onCheck={(event, isInputChecked) => {
                              Programs.update(program._id, {
                                $set: {private: isInputChecked}
                              });
                            }}
                          />
                        </TableRowColumn>
                        <TableRowColumn>
                          <RaisedButton
                            label="Edit"
                            labelPosition="before"
                            onClick={() => {
                              window.open(`/program/${program._id}`);
                            }}
                            icon={<OpenInNew />}
                          />
                          <RaisedButton
                            label="Delete"
                            onClick={function() {
                              Programs.remove(program._id);
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
                    <TableHeaderColumn>Owner</TableHeaderColumn>
                    <TableHeaderColumn>Last modified</TableHeaderColumn>
                    <TableHeaderColumn>Options</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                {
                  this.props.programs.filter((program) => {
                    return program.owner !== this.props.currentUser._id;
                  }).map((program) => {
                    return (
                      <TableRow key={program._id} >
                        <TableRowColumn>{program._id}</TableRowColumn>
                        <TableRowColumn>{program.name}</TableRowColumn>
                        <TableRowColumn>{program.username}</TableRowColumn>
                        <TableRowColumn>
                        {
                          // slice off a name of the day, e.g. 'Mon'
                          program.updatedAt.toDateString().slice(4)
                        }
                        </TableRowColumn>
                        <TableRowColumn>
                          <RaisedButton
                            label="Run"
                            onClick={() => {
                              console.log('run clicked!');
                              Programs.remove(program._id);
                              Programs.update(program._id, {
                                $set: {'test': true}
                              });
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
          ): null}
        </MuiThemeProvider>
      </PrivatePage>
    )
  }
}

export default withTracker(() => {
  const programsHandle = Meteor.subscribe('programs');

  return {
    loggingIn: Meteor.loggingIn(),
    currentUser: Meteor.user(),
    loading: !programsHandle.ready(),
    programs: Programs.find().fetch(),
  };
})(MainPage);
