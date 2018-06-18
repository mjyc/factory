import React, { Component } from 'react';
import { Redirect } from 'react-router';


export default class PrivatePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;

    if (props.loggingIn) {
      return (
        <div>Logging in...</div>
      )
    }

    if (!props.loggingIn && !props.currentUser) {
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
