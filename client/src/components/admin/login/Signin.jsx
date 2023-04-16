import {
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
// import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../Navigation/Header";
// import { base } from "../../../url/url";
const theme = createTheme();
const ErrorNotify = () => toast.error("Invalid Username or password!");
const SuccessNotify = () => toast.success("Login sucessfull");
const Signin = () => {
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
    const response = await fetch("/admin/login-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        password,
      }),
    });
    if (!(response.status === 200)) {
      ErrorNotify();
    } else {
      const res = await response.json();
      console.log("Bckend response-:", res);
      SuccessNotify();
      navigate("/admin/dashboard");
    }
  };
  React.useEffect(() => {
    if (cookie.admin && cookie.jwt) {
      navigate("/admin/");
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
          <Header name="Admin Login" />
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
                        type={"email"}
                        required
                        fullWidth
                        id="email"
                        label="Admin Id"
                        name="id"
                        autoComplete="Admin Id"
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
};

export default Signin;
