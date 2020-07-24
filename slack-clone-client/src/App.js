import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';
import Home from './pages/Home';

import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateTeam from './pages/createTeam';
import ViewTeam from './pages/ViewTeam';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
  } catch (e) {
    return false;
  }
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)
    }
  />
);

function App() {
  return (
    <Switch>
      <Route path={'/'} exact component={Home} />
      <Route path={'/register'} component={Register} />
      <Route path={'/login'} component={Login} />
      <PrivateRoute path={'/create-team'} component={CreateTeam} />
      <PrivateRoute path={'/view-team/:teamId?/:channelId?'} component={ViewTeam} />
    </Switch>
  );
}

export default App;
