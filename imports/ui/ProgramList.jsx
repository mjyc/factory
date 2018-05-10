import React from 'react';
import { PageWrapper } from 'meteor/savioke:react-common';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import { Meteor } from 'meteor/meteor';

export default class ProgramsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
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
                        label='Edit'
                      />
                      <RaisedButton
                        label='Delete'
                      />
                    </TableRowColumn>
                  </TableRow>
            </TableBody>
          </Table>
        </MuiThemeProvider>
      </div>
    );
  }
}
