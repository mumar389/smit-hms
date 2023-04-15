import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ErrorNotify = () =>
  toast.error("Error in submitting the details, please go back and retry!");
const roomNotify = (data) =>
  toast.success(
    `Room No-:${data.number}, on Floor-:${data.floor} section-:${data.segment} is allocated sucessfully`
  );
const steps = ["First User Details", "Room Allocation"];
function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [cookie] = useCookies();
  const [firstUser, setFirstUser] = React.useState({
    name: "",
    reg_no: "",
  });
  const [year, setYear] = React.useState("2");
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const [room, setRoom] = useState({
    floor: 0,
    segment: "",
    roomNo: 0,
  });
  const [random, setRandom] = React.useState(true);
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    // console.log("Active Step-:", activeStep);
    if (activeStep === 1) {
      if (random) {
        const res = await fetch("/admin/single-room-random", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.admin}`,
          },
          body: JSON.stringify({
            user1: {
              reg_no: firstUser.reg_no,
              name: firstUser.name,
              year,
            },
          }),
        });
        if (!(res.status === 200)) {
          console.log("Error in allocating");
          ErrorNotify();
          setActiveStep((prevActiveStep) => prevActiveStep - 1);
        } else {
          const dataBack = await res.json();
          console.log("Room Data-:", dataBack.data);
          const { data } = dataBack;
          roomNotify(data);
        }
      } else {
        const res = await fetch("/admin/single-room-choice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.admin}`,
          },
          body: JSON.stringify({
            user1: {
              reg_no: firstUser.reg_no,
              name: firstUser.name,
              year,
            },
            room: {
              number: room.roomNo,
              floor: room.floor,
              segment: room.segment,
            },
          }),
        });
        if (!(res.status === 200)) {
          console.log("Error in allocating");
          ErrorNotify();
          setActiveStep((prevActiveStep) => prevActiveStep - 1);
        } else {
          const dataBack = await res.json();
          console.log("Room Data-:", dataBack.data);
          const { data } = dataBack;
          roomNotify(data);
        }
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setFirstUser({
      name: "",
      reg_no: "",
    });
    setActiveStep(0);
  };

  const handleRoom = async (e) => {
    const { name, value } = e.target;
    setRoom((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleFirstUser = async (e) => {
    const { name, value } = e.target;
    setFirstUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const formone = () => {
    return (
      <Card sx={{ mt: 2, mb: 2, boxShadow: 5 }}>
        <CardContent>
          <Typography gutterBottom variant="h5"></Typography>
          <form>
            <Grid container spacing={1}>
              <Grid xs={12} sm={6} item>
                <TextField
                  name="name"
                  value={firstUser.name}
                  onChange={handleFirstUser}
                  placeholder="Enter first name"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={5} sm={6}>
                <FormControl sx={{ width: "50%" }}>
                  <InputLabel id="demo-simple-select-label">
                    Year Of Study
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={year}
                    label="Year Of Study"
                    onChange={handleYearChange}
                  >
                    <MenuItem value={2}>2nd</MenuItem>
                    <MenuItem value={3}>3rd</MenuItem>
                    <MenuItem value={4}>4th</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="reg_no"
                  value={firstUser.reg_no}
                  onChange={handleFirstUser}
                  type="text"
                  placeholder="Enter Students registration number"
                  label="reg_no"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    );
  };
  const formthree = (e) => {
    // e.preventDefault();
    return (
      <Card sx={{ mt: 2, mb: 2, boxShadow: 5 }}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            Enter Room details-:
          </Typography>
          <form>
            <Grid container spacing={1}>
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
              <Grid xs={12} sm={6} item>
                <TextField
                  onChange={handleRoom}
                  name="floor"
                  type="number"
                  value={room.floor}
                  placeholder="Enter Floor Number "
                  label="Floor"
                  variant="outlined"
                  fullWidth
                  required
                />
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
          </form>
        </CardContent>
      </Card>
    );
  };
  const choice = async (e) => {
    e.preventDefault();
    setRandom(false);
  };
  const randomRoomAlloc = async (e) => {
    e.preventDefault();
    setRandom(true);
    handleNext();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption"></Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>
                <div className="head-text">{label}</div>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1, fontSize: "52px" }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1, width: "70rem" }} component="span">
            {/* Step {activeStep + 1} */}
            {activeStep === 0 ? (
              <>{formone()}</>
            ) : (
              <>
                <Button
                  color="primary"
                  sx={{ mr: 1, fontSize: "20px" }}
                  onClick={randomRoomAlloc}
                >
                  Allocate Randomly
                </Button>
                <Button
                  color="primary"
                  sx={{ mr: 1, fontSize: "20px" }}
                  onClick={choice}
                >
                  Allocate By Choice
                </Button>
                {random === false && <>{formthree()}</>}
              </>
            )}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="primary"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1, fontSize: "20px" }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleNext}
                sx={{ fontSize: "20px" }}
                color="primary"
              >
                Finish
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                sx={{ fontSize: "20px" }}
                color="primary"
              >
                Next
              </Button>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

const SingleRoom = () => {
  return <HorizontalLinearStepper />;
};

export default SingleRoom;
