import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class PrivatePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;

    console.log('PrivatePage', props);

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
