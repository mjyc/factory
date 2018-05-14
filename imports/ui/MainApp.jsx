import React, { Component } from 'react';
import { Redirect } from 'react-router';
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
import { withTracker } from 'meteor/react-meteor-data';

// MainApp component - represents the whole app for the main page
class MainApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      Meteor.defer(() => {
        this.setState({ready: true});
      });
    }
  }

  render() {
    console.log('MainApp', this.props);

    const location = this.props.location;

    if (!this.state.ready) {
      return (
        <div>Loading...</div>
      )
    }

    if (!this.props.currentUser) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: location}
          }}
        />
      )
    }

    return (
      <MuiThemeProvider>
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
      </MuiThemeProvider>
    )
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(MainApp);
