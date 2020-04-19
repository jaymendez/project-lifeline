import React, { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Tab,
  Tabs,
  Drawer,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search,
  AccountBox,
  Assignment,
  ShowChart,
  Settings,
  Home,
  AccountCircle,
  DesktopWindows
} from "@material-ui/icons";
import TabPanel from "../utils/components/tab/TabPanel";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer(props) {
  const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [menu] = useState([
    { name: "HOME", link: "home" },
    { name: "PATIENT REGISTRATION", link: "register" },
    { name: "PATIENT LIST", link: "list" },
    { name: "MONITORING SETTINGS", link: "report" },
    { name: "SETTINGS", link: "settings" },
  ]);
  const [wards] = useState(["Ward 1", "Ward 2", "Ward 3"]);
  const [menuIcons] = useState([
    <Home />,
    <AccountBox />,
    <Assignment />,
    <DesktopWindows />,
    <Settings />,
  ]);
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            WARD 1
          </Typography>
          {/* <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="HOME" style={{ minHeight: "64px" }} />
            {wards.map((el) => {
              return <Tab label={el} style={{ minHeight: "64px" }} />;
            })}
          </Tabs> */}
          <div className={classes.grow} />
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={menuAnchor}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(menuAnchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button>
            {!open ? (
              <ListItemIcon>
                <Search />
              </ListItemIcon>
            ) : (
              ""
            )}
            <ListItemText
              primary={
                <TextField
                  className={classes.margin}
                  id="input-with-icon-textfield"
                  // label="Search"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              }
            />
          </ListItem>
          {menu.map((el, i) => {
            const { name, link } = el;
            return (
              <Link
                key={name}
                to={{
                  pathname: `/${link}`,
                  state: {},
                }}
                style={{ color: "#606060", textDecoration: "none", fontWeight: "bold" }}
              >
                <ListItem button>
                  <ListItemIcon>{menuIcons[i]}</ListItemIcon>
                  <ListItemText primary={<span style={{ fontWeight: "bold" }}>{name}</span>} />
                </ListItem>
              </Link>
            );
          })}

        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
        {/* <TabPanel value={value} index={0}>
          {children}
        </TabPanel>
        {wards.map((el, i) => {
          return (
            <TabPanel value={value} index={i}>
              {el}
            </TabPanel>
          );
        })} */}
      </main>
    </div>
  );
}
