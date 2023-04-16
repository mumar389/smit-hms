import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { MdOutlineFeed } from "react-icons/md";
import { AiFillHome } from "react-icons/ai";
import { BiHotel } from "react-icons/bi";
import MailIcon from "@mui/icons-material/Mail";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Avatar, Badge, Fade, Menu, MenuItem } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import {base}from "../../../url/url"
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = (props) => {
  const { nl } = props;
  const navigate = useNavigate();
  const menuItem = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <AiFillHome />,
    },
    {
      path: "/admin/room-alloc",
      name: "Room Allocation",
      icon: <BiHotel />,
    },

    {
      path: "/admin/complains",
      name: "Complain Management",
      icon: <MdOutlineFeed />,
    },
    {
      path: "/admin/fetch-rooms",
      name: "Search Room",
      icon: <BiHotel />,
    },

    {
      path: "/admin/all-req",
      name: "Room Change",
      icon: <MdOutlineFeed />,
    },
    {
      path: "/admin/get-leave",
      name: "Leaves",
      icon: <MdOutlineFeed />,
    },
  ];
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [cookie] = useCookies();
  const ErrorNotify = () => toast.error("Login as admin to continue!!");
  const SuccessNotify = () => toast.success("Logout Success!!");

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await fetch("/admin/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (!(response.status === 200)) {
      console.log("Error in logging out|| admin is not logged in");
      ErrorNotify();
    } else {
      SuccessNotify();
      window.open(`${base}/admin/signin`, "_self");
    }
  };

  const handleNotify = (e) => {
    navigate("notify-page");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar color="default" position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            HMS
          </Typography>
          <Avatar
            id="fade-button"
            aria-controls={openMenu ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            sx={{
              bgcolor: lightBlue[500],
              cursor: "pointer",
              position: "absolute",
              right: "10%",
            }}
            onClick={handleClick}
          >
            A
          </Avatar>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/update-password");
              }}
            >
              Change password
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Home
            </MenuItem>
          </Menu>
          <Badge
            sx={{ cursor: "pointer", position: "absolute", right: "20%" }}
            badgeContent={nl}
            color="primary"
          >
            <MailIcon onClick={handleNotify} color="action" />
          </Badge>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItem.map((m, index) => {
            return (
              <>
                <NavLink
                  to={m.path}
                  key={index}
                  style={{ textDecoration: "none" }}
                >
                  <ListItem
                    disablePadding
                    sx={{ display: "block", color: "#559D8B" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 1.5,
                        pb: 2,
                        fontWeight: "Bold",
                        fontSize: "25px",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {m.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={m.name}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </NavLink>
              </>
            );
          })}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
