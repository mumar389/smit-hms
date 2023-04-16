import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { base } from "../../url/url";

export default function Navbar() {
  const ErrorNotify = () => toast.error("Login as admin to continue!!");
  const SuccessNotify = () => toast.success("Logout Success!!");
  const [cookie] = useCookies();
  const adminLogout = async (e) => {
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
      //console.log("Logout sucessfull");
      SuccessNotify();
      // setInterval(() => {
      // }, 100);
      window.open(`${base}/`, "_self");
      // navigate('/admin/signin')
    }
  };

  const userLogout = async (e) => {
    e.preventDefault();
    const response = await fetch("/users/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
    });
    if (!(response.status === 200)) {
      console.log("Error in logging out|| admin is not logged in");
      ErrorNotify();
      // navigate("/users/");
    } else {
      //console.log("Logout sucessfull");
      SuccessNotify();
      // setInterval(() => {
      // }, 600);
      window.open(`${base}/`, "_self");
      // navigate('/admin/signin')
    }
  };
  const wardenLogout = async (e) => {
    e.preventDefault();
    const response = await fetch("/wardens/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.warden}`,
      },
    });
    if (!(response.status === 200)) {
      console.log("Error in logging out|| admin is not logged in");
      ErrorNotify();
    } else {
      SuccessNotify();
      // setInterval(() => {
        
      // }, 600);
      window.open(`${base}/`, "_self");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="success">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 0 }}
          ></IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            SMIT-Hostel Management System
          </Typography>
          {cookie.admin ? (
            <>
              <Button
                onClick={adminLogout}
                sx={{ mt: 3, mb: 2, textDecoration: "none", color: "white" }}
              >
                Logout
              </Button>
              <Button sx={{ mt: 3, mb: 2 }}>
                <Link
                  to="/admin/dashboard"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Admin Home
                </Link>
              </Button>
            </>
          ) : (
            <>
              {cookie.jwt ? (
                <>
                  <Button
                    onClick={userLogout}
                    sx={{
                      mt: 3,
                      mb: 2,
                      textDecoration: "none",
                      color: "white",
                    }}
                  >
                    Logout
                  </Button>
                  <Button sx={{ mt: 3, mb: 2 }}>
                    <Link
                      to="/users/"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      User Home
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {cookie.warden ? (
                    <>
                      <Button
                        onClick={wardenLogout}
                        sx={{
                          mt: 3,
                          mb: 2,
                          textDecoration: "none",
                          color: "white",
                        }}
                      >
                        Logout
                      </Button>
                      <Button sx={{ mt: 3, mb: 2 }}>
                        <Link
                          to="/warden/dashboard"
                          style={{ textDecoration: "none", color: "white" }}
                        >
                          Warden Home
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button sx={{ mt: 3, mb: 2 }}>
                        <Link
                          to="/users/signin"
                          style={{ textDecoration: "none", color: "white" }}
                        >
                          Student Login
                        </Link>
                      </Button>
                      <Button sx={{ mt: 3, mb: 2 }}>
                        <Link
                          to="/admin/signin"
                          style={{ textDecoration: "none", color: "white" }}
                        >
                          Admin Login
                        </Link>
                      </Button>
                      <Button sx={{ mt: 3, mb: 2 }}>
                        <Link
                          to="/warden/signin"
                          style={{ textDecoration: "none", color: "white" }}
                        >
                          Warden Login
                        </Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
