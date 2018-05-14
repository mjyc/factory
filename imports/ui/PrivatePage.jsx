import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class PrivatePage extends Component {
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
    const props = this.props;

    if (!this.state.ready) {
      return (
        <div>Loading...</div>
      )
    }

    if (!props.currentUser) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: props.location}
          }}
        />
      )
    }

    return (
      props.children
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user(),
  };
})(PrivatePage);
