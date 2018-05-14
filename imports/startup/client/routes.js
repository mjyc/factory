import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import {  } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx'
import MainApp from '../../ui/MainApp.jsx'
import EditApp from '../../ui/EditApp.jsx'

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/login" component={AccountsUIWrapper}/>
      <Route exact path="/" component={MainApp}/>
      <Route exact path="/edit" component={EditApp}/>
    </Switch>
  </Router>
);
