import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import {  } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx'
import MainApp from '../../ui/MainApp.jsx'
import EditApp from '../../ui/EditApp.jsx'

const browserHistory = createBrowserHistory();

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      // TODO(mjyc): check if it is secure to call Meteor.user() here
      console.log('PrivateRoute', props, Meteor.user());
      return Meteor.user() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: props.location}
          }}
        />
      )
    }}
  />
);

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/login" component={AccountsUIWrapper}/>
      <PrivateRoute exact path="/" component={MainApp}/>
      <PrivateRoute exact path="/edit" component={EditApp}/>
    </Switch>
  </Router>
);
