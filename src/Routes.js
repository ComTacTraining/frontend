import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppliedRoute from './components/AppliedRoute/AppliedRoute';
import MemberRoute from './components/MemberRouter/MemberRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute/UnauthenticatedRoute';
import Home from './containers/Home/Home';
import About from './containers/About/About';
import Contact from './containers/Contact/Contact';
import Register from './containers/Register/Register';
import Login from './containers/Login/Login';
import Billing from './containers/Billing/Billing';
import Demo from './containers/Demo/Demo';
import Profile from './containers/Profile/Profile';
import Dashboard from './containers/Dashboard/Dashboard';
import Evolution from './components/Evolution/Evolution';
import NotFound from './containers/NotFound/NotFound';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path='/' exact component={Home} props={childProps} />
    <AppliedRoute
      path='/contact'
      exact
      component={Contact}
      props={childProps}
    />
    <UnauthenticatedRoute
      path='/about'
      exact
      component={About}
      props={childProps}
    />
    <UnauthenticatedRoute
      path='/register'
      exact
      component={Register}
      props={childProps}
    />
    <UnauthenticatedRoute
      path='/login'
      exact
      component={Login}
      props={childProps}
    />
    <AuthenticatedRoute
      path='/billing'
      exact
      component={Billing}
      props={childProps}
    />
    <AuthenticatedRoute
      path='/profile'
      exact
      component={Profile}
      props={childProps}
    />
    <AuthenticatedRoute
      path='/demo'
      exact
      component={Demo}
      props={childProps}
    />
    <MemberRoute
      path='/dashboard'
      exact
      component={Dashboard}
      props={childProps}
    />
    <MemberRoute
      path='/evolutions/:id'
      component={Evolution}
      props={childProps}
    />
    <Route component={NotFound} />
  </Switch>
);
