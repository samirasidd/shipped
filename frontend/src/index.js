import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import React from "react";
import { store, history } from "./store";
import posthog from "posthog-js";

import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";

import App from "./components/App";

posthog.init("phc_ok2d6V89D3SAEjruyfpFYxHnvqZsyqGLeoNgXx932swf", {
  api_host: "https://us.i.posthog.com",
 capture_exceptions: true,
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>,

  document.getElementById("root"),
);