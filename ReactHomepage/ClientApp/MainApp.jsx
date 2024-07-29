import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, BrowserRouter, StaticRouter } from 'react-router-dom';
import Frame from './Frame';
import Home from './home/Home';
import Albums from './albums/Albums';
import Photos from './photos/Photos';
import User from './user/User';
import Details from './details/Details';
import NotFound from './NotFound';
import { UserProvider } from './user/UserContext';
import { isNode } from './isNode';

export default class MainApp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Router = isNode() ? StaticRouter : BrowserRouter;
    const routerProps = isNode() ? { location: this.props.location, context: {} } : {};

    return (
      <UserProvider>
        <Router {...routerProps}>
          <Frame>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/albums" component={isNode() ? NotFound : Albums} />
              <Route path="/photos/:albumId/:albumCaption" render={isNode() ? NotFound : (props) => <Photos {...props} />} />
              <Route path="/details/:photoId/:albumId/:albumCaption" component={isNode() ? NotFound : Details} />
              <Route path="/user" component={isNode() ? NotFound : User} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Frame>
        </Router>
      </UserProvider>
    );
  }
}
