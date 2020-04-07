import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import MiniDrawer from "./components/layouts/Drawer";
import Home from "./components/Dashboard/Home";
import PatientList from "./components/Patient/List";
import PatientRegister from "./components/Patient/Register";

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
          <MiniDrawer>
            <Route path="/home" component={Home} />
            <Route path="/list" component={PatientList} />
            <Route path="/register" component={PatientRegister} />
          </MiniDrawer>

        </Switch>
      </ThemeProvider>
    </div>
  );
}

export default App;
