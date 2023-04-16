import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Card, CardContent, IconButton, InputAdornment } from "@mui/material";
import React from "react";
import Header from "../Navigation/Header";

import { base } from "../../../url/url";
import { useCookies } from "react-cookie";
const UpdatePasswordWarden = () => {
  const [cookie] = useCookies();
  const theme = createTheme();
  // const ErrorNotify = () =>
  //   toast.error("Error in updating password please retry!");
  const ErrorNotifyParams = (msg) => toast.error(`${msg}`);
  const SuccessNotify = () => toast.success("Password Changed Sucessfully");
  // const [cookie] = useCookies();
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [type, setType] = React.useState("password");
  const handleClickShowPassword = (e) => {
    setType("text");
    setShow(true);
  };
  const handleMouseDownPassword = (e) => {
    setType("password");
    setShow(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const { old, newp } = {
      old: data.get("old"),
      newp: data.get("newp"),
    };
    const response = await fetch("/wardens/update-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.warden}`,
      },
      body: JSON.stringify({
        oldP: old,
        newP: newp,
      }),
    });
    if (response.status === 301) {
      const res = await response.json();
      const { message } = res;
      ErrorNotifyParams(message);
      navigate("/warden/new-password");
    } else if (response.status === 200) {
      const res = await response.json();
      console.log("Bckend response-:", res);
      SuccessNotify();
      window.open(`${base}/warden/dashboard`, "_self");
    } else {
      console.log("Error");
      ErrorNotifyParams("Error");
    }
  };
  return (
    <>
      <Box height={40} />
      <Box
        sx={{
          width: "100%",
          height: "90rem",
        }}
      >
        <Box
          sx={{
            height: "201px",
            backgroundColor: "#7BC4B2",
          }}
        >
          <Header name="Update Your Password" />
        </Box>
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            top: "-5%",
          }}
        >
          <Card
            sx={{
              opacity: 0.85,
              boxShadow: 5,
              backgroundColor: "#F7F7F7",
            }}
            className="form-design"
          >
            <CardContent>
              <ThemeProvider theme={theme}>
                <Container
                  component="main"
                  className="signin-page"
                  maxWidth="xs"
                >
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h6">
                      !!Set a secure password
                    </Typography>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 0 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="old"
                        label="Old Password"
                        type={type}
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                          // <-- This is where the toggle button is added.
                          endAdornment: (
                            <>
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {show ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newp"
                        label="New Password"
                        type={type}
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                          // <-- This is where the toggle button is added.
                          endAdornment: (
                            <>
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {show ? (
                                    <VisibilityIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        color="success"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Update
                      </Button>
                    </Box>
                  </Box>
                </Container>
              </ThemeProvider>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default UpdatePasswordWarden;
