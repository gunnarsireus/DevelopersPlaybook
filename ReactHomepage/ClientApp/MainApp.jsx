﻿import React, { useState, useEffect } from 'react';
import { Switch, Route, BrowserRouter, StaticRouter } from 'react-router-dom';
import Frame from './Frame';
import Home from './home/Home';
import Albums from './albums/Albums';
import Photos from './photos/Photos';
import User from './user/User';
import Details from './details/Details';
import NotFound from './NotFound';
import { UserProvider } from './user/UserContext';

const MainApp = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Update the `isClient` state to true if `window` is defined (i.e., client-side)
    setIsClient(typeof window !== 'undefined');
  }, []);

  const Router = !isClient ? StaticRouter : BrowserRouter;
  const routerProps = !isClient ? { location: props.location, context: {} } : {};

  return (
    <UserProvider>
      <Router {...routerProps}>
        <Frame>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/albums" component={!isClient ? NotFound : Albums} />
            <Route path="/photos/:albumId/:albumCaption" render={!isClient ? NotFound : (props) => <Photos {...props} />} />
            <Route path="/details/:photoId/:albumId/:albumCaption" component={!isClient ? NotFound : Details} />
            <Route path="/user" component={!isClient ? NotFound : User} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Frame>
      </Router>
    </UserProvider>
  );
};

export default MainApp;
