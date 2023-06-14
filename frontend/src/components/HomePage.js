import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import EnterDetails from "./EnterDetails";
import VerifyAttendance from "./VerifyAttendance";
import DownloadAttendance from "./DownloadAttendance";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <p>This is the home page</p>
          </Route>
          <Route path="/join" component={RoomJoinPage} />
          <Route path="/details" component={EnterDetails} />
          <Route path="/verify-attendance"
            render={(props) => <VerifyAttendance{...props} additionalProp="sample value" />}
          />
          <Route path="/download-attendance"
            render={(props) => <DownloadAttendance{...props} additionalProp="sample value" />}
          />
        </Switch>
      </Router>
    );
  }
}
