import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ErrorNotify = (msg) => toast.error(`${msg}`);
const userNotify = (data) => toast.success(`${data}`);
const Single = () => {
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    floor: 1,
    segment: "",
    roomNo: 0,
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
        changeType: "Single",
        number: room.roomNo,
        floor: room.floor,
        segment: room.segment,
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
      setRoom({
        floor: 1,
        segment: "",
        roomNo: 0,
      });
      navigate("/users/change-request");
      // setInterval(() => {
      //   navigate("/users/get-request");
      // }, 650);
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
              <Grid xs={12} sm={6} item>
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
const SingleForm = () => {
  return <Single />;
};

export default SingleForm;
