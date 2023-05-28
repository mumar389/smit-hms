import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CardContent, Grid } from "@mui/material";
import { Container } from "@mui/system";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";
import HeaderUsers from "../Navigation/HeaderUsers";
const ErrorNotify = () =>
  toast.error("Error in submitting, please fill the details correctly!");
const userNotify = () =>
  toast.success(
    "Complain Registered Sucessfully,Your problem will be solved soon!!"
  );
const CreateComplain = (props) => {
  const {socket,user}=props;
  const [cookie] = useCookies();
  const [desc, setDesc] = React.useState("");
  const [type, setType] = React.useState("");
  const [date, setDate] = React.useState("");
  const handleDate = (e) => {
    setDate(e.target.value);
  };
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleDesc = async (e) => {
    const { value } = e.target;
    setDesc(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/users/register-complain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
      body: JSON.stringify({
        type,
        desc,
        pref_date: date,
      }),
    });
    if (!(res.status === 200)) {
      console.log("Error in saving complain");
      ErrorNotify();
    } else {
      const data = await res.json();
      console.log(data);
      userNotify();
    }
    socket.emit('send-notify',{
      type:type,
      user:user.name
    });
    setDate("");
    setDesc("");
    setType("");
    
  };
  const formone = () => {
    return (
      <Card sx={{ mt: 5, mb: 2, boxShadow: 5 }}>
        <CardContent>
          {/* <Typography gutterBottom variant="h5">
                  Fill Form To Register Your Complain-:
                </Typography> */}
          <br />
          {/* <Grid container spacing={2} sx={{mb:2}}> */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ minWidth: 120, maxWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Complain Type
                </InputLabel>
                <Select
                  sx={{ mb: 2 }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="complain"
                  onChange={handleChange}
                >
                  <MenuItem value={"Electrical Complain"}>
                    Electrical Complain
                  </MenuItem>
                  <MenuItem value={"Carpentry Complain"}>
                    Carpentry Complain
                  </MenuItem>
                  <MenuItem value={"Sanitary Complain"}>
                    Sanitary Complain
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid xs={12} sm={6} item sx={{ mb: 4 }}>
              <InputLabel id="simple-select-label">
                Resolution Date-:
              </InputLabel>
              <TextField
                onChange={handleDate}
                value={date}
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
          <HeaderUsers name="Create Complain" />
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

export default CreateComplain;
