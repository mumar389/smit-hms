import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import {
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import HeaderUsers from "../Navigation/HeaderUsers";
import SwapForm from "./SwapForm";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
// import SingleForm from "./SingleForm";
// import { base } from "../../../url/url";
const ErrorNotify = (msg) => toast.error(`${msg}`);
const userNotify = (data) => toast.success(`${data}`);

const NewRoom = () => {
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    floor: 1,
    segment: "",
    roomNo: 0,
    count: 2,
    type: "Double",
  });
  const handleRoom = async (e) => {
    const { name, value } = e.target;
    setRoom((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const [reason, setReason] = useState("");
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const res = await fetch("/users/create-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
      body: JSON.stringify({
        reason,
        changeType: "New",
        number: room.roomNo,
        floor: room.floor,
        segment: room.segment,
        type: room.type,
        count: room.count,
      }),
    });
    if (res.status === 301 || res.status === 422) {
      console.log("Error");
      const resp = await res.json();
      const { message } = resp;
      ErrorNotify(message);
    } else if (res.status === 200) {
      const response = await res.json();
      const { message } = response;
      userNotify(message);
      // window.open(`${base}/users/change-request`, "_self");
      navigate("/users/change-request");
    }
  };
  return (
    <>
      <Card sx={{ mt: 2, mb: 2, boxShadow: 5 }}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            Enter Room details-:
          </Typography>
          <form>
            <Grid container spacing={1}>
              <Grid xs={12} sm={12} item>
                <TextField
                  onChange={handleReasonChange}
                  name="reason"
                  type="text"
                  value={reason}
                  placeholder="Enter Reason For Room Change "
                  label="Reason"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid xs={12} sm={6} item>
                <TextField
                  onChange={handleRoom}
                  name="roomNo"
                  type="number"
                  value={room.roomNo}
                  placeholder="Enter Room Number "
                  label="Room Number"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={5} sm={6}>
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="demo-simple-select-label">
                    Select Floor
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={room.floor}
                    label="Floor"
                    name="floor"
                    onChange={handleRoom}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} item sx={{ mb: 2 }}>
                <TextField
                  onChange={handleRoom}
                  name="segment"
                  value={room.segment}
                  placeholder="Enter Segment"
                  label="Segment"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={5} sm={6} sx={{ mt: 1 }}>
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="demo-simple-select-label" sx={{ mb: 2 }}>
                    Count of Students Want To Change
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={room.count}
                    label="Count"
                    name="count"
                    onChange={handleRoom}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {room.count === 1 ? (
                <>
                  <Grid item xs={5} sm={6}>
                    <FormControl sx={{ width: "50%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Room Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={room.type}
                        label="Type"
                        name="type"
                        onChange={handleRoom}
                      >
                        <MenuItem value={"Single"}>Single</MenuItem>
                        <MenuItem value={"Double"}>Double</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={5} sm={6}>
                    <FormControl sx={{ width: "50%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Room Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={room.type}
                        label="Type"
                        name="type"
                        onChange={handleRoom}
                      >
                        <MenuItem value={"Double"}>Double</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <Button
              sx={{ mt: 2 }}
              onClick={handleForm}
              variant="outlined"
              color="success"
            >
              Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

const ChangeForm = () => {
  const [type, setType] = React.useState("newRoom");
  const handleRadioChange = (e) => {
    setType(e.target.value);
  };

  // const [checked, setCheck] = useState("newRoom");
  // const handleCheck = (e) => {
  //   e.preventDefault();
  //   const { name, value } = e.target;
  //   setCheck(() => {
  //     return {
  //       [name]: value,
  //     };
  //   });
  // };
  return (
    <>
      <Box height={40}></Box>
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
          <HeaderUsers name="Room Change" />
        </Box>

        <>
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
              }}
              className="form-design"
            >
              <CardContent>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Change Type
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      name="newRoom"
                      value="newRoom"
                      control={<Radio />}
                      label="new Room Alloc"
                    />
                    <FormControlLabel
                      name="swap"
                      value="swap"
                      control={<Radio />}
                      label="Room Mate Swap"
                    />
                  </RadioGroup>
                </FormControl>
                {type === "newRoom" && (
                  <>
                    <NewRoom />
                  </>
                )}
                {type === "swap" && <SwapForm />}
              </CardContent>
            </Card>
          </Container>
        </>
      </Box>
    </>
  );
};

export default ChangeForm;
