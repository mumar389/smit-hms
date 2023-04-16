import * as React from "react";
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
import { Link, useNavigate } from "react-router-dom";
//Outlet
import { useCookies } from "react-cookie";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Card, CardContent, IconButton, InputAdornment } from "@mui/material";
import HeaderUsers from "../Navigation/HeaderUsers";
// import { base } from "../../../url/url";

const theme = createTheme();
const ErrorNotify = () => toast.error("Invalid Username or password!");
const SuccessNotify = () => toast.success("Login sucessfull");

function SignIn() {
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [type, setType] = React.useState("password");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const { id, password } = {
      id: data.get("id"),
      password: data.get("password"),
    };
    // console.log("id-:",id);
    // console.log("pass-:",password);
    const response = await fetch("/users/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
      body: JSON.stringify({
        id,
        password,
      }),
    });
    if (!(response.status === 200)) {
      // console.log("Failed to login");
      ErrorNotify();
    } else {
      SuccessNotify();
      // setInterval(() => {
      // }, 650);
      navigate("/users/");
    }
  };
  React.useEffect(() => {
    if (cookie.jwt && cookie.users) {
      navigate("/users/");
    }
    // eslint-disable-next-line
  }, []);
  const handleClickShowPassword = (e) => {
    setType("text");
    setShow(true);
  };
  const handleMouseDownPassword = (e) => {
    setType("password");
    setShow(false);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "70rem",
        }}
      >
        <Box
          sx={{
            height: "201px",
            backgroundColor: "#7BC4B2",
          }}
        >
          <HeaderUsers name="Student Login" />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            top: "-5%",
            left: "10%",
            backgroundColor: "F7F7F7",
          }}
        >
          <Card sx={{ width: "70%", mb: 2, boxShadow: 5, height: "700px" }}>
            <CardContent sx={{ backgroundColor: "F7F7F7" }}>
              <ThemeProvider theme={theme}>
                <Container
                  component="main"
                  className="signin-page"
                  maxWidth="xs"
                >
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                      Sign in
                    </Typography>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      noValidate
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        type={"text"}
                        required
                        fullWidth
                        id="email"
                        label="Registration Number"
                        name="id"
                        autoComplete="off"
                        autoFocus
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
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
                        Sign In
                      </Button>
                    </Box>
                    <Link style={{ textDecoration: "none" }} to="/">
                      Go Back To Home
                    </Link>
                  </Box>
                </Container>
              </ThemeProvider>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

const Login = () => {
  return (
    <>
      <SignIn />
    </>
  );
};

export default Login;
