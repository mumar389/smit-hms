import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { CardContent, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";
import HeaderUsers from "../Navigation/HeaderUsers";
const ErrorNotify = (msg) => toast.error(`${msg}`);
const userNotify = (msg) => toast.success(`${msg}`);
const LeaveForm = (props) => {
  const [cookie] = useCookies();
  const [desc, setDesc] = React.useState("");
  const [date, setDate] = React.useState("");
  const [to, setTo] = React.useState("");
  const handleDate = (e) => {
    setDate(e.target.value);
  };
  const handleTo = (e) => {
    setTo(e.target.value);
  };

  const handleDesc = async (e) => {
    const { value } = e.target;
    setDesc(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/users/apply-leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
      body: JSON.stringify({
        reason: desc,
        to,
        from: date,
      }),
    });
    if (res.status === 301) {
      console.log("Error in saving complain");
      const resp = await res.json();
      const { message } = resp;
      ErrorNotify(message);
    } else {
      const data = await res.json();
      //   console.log(data);
      const { message } = data;
      userNotify(message);
    }
    setDate("");
    setDesc("");
    setTo("");
  };
  const formone = () => {
    return (
      <Card sx={{ mt: 5, mb: 2, boxShadow: 5 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid xs={12} sm={6} item sx={{ mb: 4 }}>
              <InputLabel id="simple-select-label">From -:</InputLabel>
              <TextField
                onChange={handleDate}
                value={date}
                type={"date"}
                placeholder="Enter Resolution Date"
                variant="outlined"
                required
              />
            </Grid>
            <Grid xs={12} sm={6} item sx={{ mb: 4 }}>
              <InputLabel id="simple-select-label">To-:</InputLabel>
              <TextField
                onChange={handleTo}
                value={to}
                type={"date"}
                placeholder="Enter Resolution Date"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ mb: 5 }}>
              <TextField
                name="desc"
                value={desc}
                onChange={handleDesc}
                multiline
                placeholder="Enter description of complain...."
                label="Description"
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={10} sx={{ mb: 5 }} maxWidth={500}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </form>
          {/* </Grid> */}
        </CardContent>
      </Card>
    );
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
          <HeaderUsers name="Apply Leave" />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            top: "-5%",
            p: 0,
          }}
        >
          <Card
            sx={{
              opacity: 0.85,
              boxShadow: 5,
            }}
            className="form-design"
          >
            <CardContent>{formone()}</CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default LeaveForm;
