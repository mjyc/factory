import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import AccountsUIWrapper from '../../ui/AccountsUIWrapper.jsx'
import MainPage from '../../ui/MainPage.jsx'
import EditPage from '../../ui/EditPage.jsx'
import SettingsPage from '../../ui/SettingsPage.jsx'

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/login" component={AccountsUIWrapper}/>
      <Route exact path="/" component={MainPage}/>
      <Route exact path="/programs/:id" component={EditPage}/>
      <Route exact path="/settings" component={SettingsPage}/>
    </Switch>
  </Router>
);
