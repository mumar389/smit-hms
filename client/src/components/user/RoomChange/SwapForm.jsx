import {
  Button,
  Card,
  CardContent,
  Grid,
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
const Swap = () => {
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [reg_no, setRegNo] = useState("");
  const handleRoom = async (e) => {
    const { value } = e.target;
    setRegNo(value);
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
        changeType: "Swap",
        reg_no,
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
      setRegNo("");
      setReason("");
      navigate("/users/change-request");
      // setInterval(() => {
      // }, 650);
    }else{
      ErrorNotify("Error");

    }
  };
  return (
    <>
      <Card sx={{ mt: 2, mb: 2, boxShadow: 5 }}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            Enter details-:
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
                <Typography gutterBottom variant="h6">
                  Enter Registration Number of student you want to Shift with-:
                </Typography>
                <TextField
                  onChange={handleRoom}
                  name="roomNo"
                  type="number"
                  value={reg_no}
                  placeholder="Enter Registration Number of student want to change "
                  label="Reg No"
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
const SwapForm = () => {
  return <Swap />;
};

export default SwapForm;
