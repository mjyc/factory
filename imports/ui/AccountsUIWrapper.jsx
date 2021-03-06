import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { withTracker } from 'meteor/react-meteor-data';

class AccountsUIWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.view = Blaze.render(Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container));
  }
  componentDidUpdate(prevProps) {
    if (prevProps.loggingIn && !prevProps.currentUser) {
      this.view = Blaze.render(Template.loginButtons,
        ReactDOM.findDOMNode(this.refs.container));
    }
  }
  componentWillUnmount(prev) {
    Blaze.remove(this.view);
  }
  render() {
    if (this.props.loggingIn) {
      return (
        <div>Logging in...</div>
      )
    }

    // redirect to where the user came from
    let {from} = this.props.location.state || {from: {pathname: '/'}};
    if (!from) { from = {pathname: '/'}; }

    if (!this.props.loggingIn && this.props.currentUser) {
      return <Redirect to={from} />
    }

    return <span ref="container" />;
  }
}

export default withTracker(() => {
  return {
    loggingIn: Meteor.loggingIn(),
    currentUser: Meteor.user(),
  };
})(AccountsUIWrapper);
