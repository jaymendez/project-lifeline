import React, { useEffect } from "react";
import { Route, Switch, withRouter, Redirect, useHistory } from "react-router-dom";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import MiniDrawer from "./components/layouts/Drawer";
import Home from "./components/Dashboard/Home";
import TelemetryDashboard from "./components/Monitor/Telemetry/Dashboard";
import ListMonitor from "./components/Monitor/List";
import CreateMonitor from "./components/Monitor/Create";
import SetupMonitor from "./components/Monitor/Setup";
import PatientList from "./components/Patient/List";
import PatientRegister from "./components/Patient/Register";
import PatientDetails from "./components/Patient/Details";
import Testing from "./components/utils/components/testing";
import AuthenticateUser from "./components/utils/components/dialog/AuthDialog";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    // fontFamily: ['"Lato"', "Open Sans", "sans-serif"].
  },
  // textDecoration: "none",
});

function App() {
  const history = useHistory();
  const auth = localStorage.getItem("authenticated") === "true";

  let killSession = () => {
    var minutes = 30; //Kill session in 40 minutes
    var duration = minutes * 60;
    var idleTime = 0;
    var idleInterval = setInterval(timerIncrement, duration * 1000); // 1 second

    //Zero the idle timer on mouse movement.
    window.onload = window.onfocus = function () {
      document.onmousemove = function (e) {
        // console.log('test')
        idleTime = 0;
      };
      document.onkeypress = function (e) {
        // console.log('test')
        idleTime = 0;
      };
    };
    window.onblur = function () {
      // console.log(idleTime);
      console.log("User is away");
    };

    function timerIncrement() {
      idleTime = idleTime + 1;
      if (idleTime > 1) {
        localStorage.setItem("authenticated", false);
        history.go(0)
      }
    }
  };

  useEffect(() => {
    if (auth) {
      killSession();
    }
    // inactivityTime();
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/testing" component={Testing} />
          {/* <Route path="/monitors" component={TelemetryDashboard} /> */}
          <Route path="/telemetry/:id" component={TelemetryDashboard} />
          {!auth ? (
            <AuthenticateUser />
          ) : (
            <MiniDrawer>
              <Route exact path="/" component={PatientList} />
              <Route path="/home" component={Home} />
              <Route path="/patient/details/:id" component={PatientDetails} />
              <Route path="/patient/list" component={PatientList} />
              <Route path="/patient/register" component={PatientRegister} />
              <Route path="/patient/update/:id" component={PatientRegister} />
              <Route path="/monitor/setup" component={SetupMonitor} />
              <Route path="/monitor/list" component={ListMonitor} />
              {/* <Route path="/monitor/create" component={CreateMonitor} /> */}
              {/* <Route path="/telemetry/:id" component={TelemetryDashboard} /> */}
              {/* <Route path="/patient/:id" component={CreateMonitor} /> */}
              {/* <Route path="/monitor/setup" component={MonitorSetup} /> */}
            </MiniDrawer>
          )}
        </Switch>
      </ThemeProvider>
    </div>
  );
}

export default App;
