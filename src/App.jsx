import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
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
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/testing" component={Testing} />
          <Route path="/monitors" component={TelemetryDashboard} />
          <Route path="/telemetry/:id" component={TelemetryDashboard} />
          <MiniDrawer>
            <Route path="/home" component={Home} />
            <Route path="/patient/details/:id" component={PatientDetails} />
            <Route path="/patient/list" component={PatientList} />
            <Route path="/patient/register" component={PatientRegister} />
            <Route path="/monitor/setup" component={SetupMonitor} />
            <Route path="/monitor/list" component={ListMonitor} />
            {/* <Route path="/monitor/create" component={CreateMonitor} /> */}
            {/* <Route path="/telemetry/:id" component={TelemetryDashboard} /> */}
            {/* <Route path="/patient/:id" component={CreateMonitor} /> */}
            {/* <Route path="/monitor/setup" component={MonitorSetup} /> */}
          </MiniDrawer>
        </Switch>
      </ThemeProvider>
    </div>
  );
}

export default App;
