import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
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
import React from "react";
import Header from "../Navigation/Header";
import SingleRoom from "./SingleRoom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import UploadFile from "./UploadFile"
const steps = ["First User Details", "Second User Details"];
const ErrorNotify = () =>
  toast.error("Error in submitting the details, please retry again!");
const userNotify = (data) =>
  toast.success(
    `Room No-:${data.number}, on Floor-:${data.floor} section-:${data.segment} is allocated sucessfully`
  );
function HorizontalLinearStepper() {
  const [formRadio, setformRadio] = React.useState("no");
  const [year, setYear] = React.useState("2");
  const [activeStep, setActiveStep] = React.useState(0);
  const [cookie] = useCookies();
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const [mate, setMate] = React.useState("");
  const handleRoommate = (e) => {
    setMate(e.target.value);
  };
  const [skipped, setSkipped] = React.useState(new Set());
  const [firstUser, setFirstUser] = React.useState({
    name: "",
    reg_no: "",
  });
  const [secondUser, setSecondUser] = React.useState({
    name: "",
    reg_no: "",
  });
  const [year2, setYear2] = React.useState("2");
  const handleSecondYear = async (e) => {
    setYear2(e.target.value);
  };
  // const [random, setRandom] = React.useState(true);
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
    if (activeStep === 1) {
      const res = await fetch("/admin/double-room-mate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.admin}`,
        },
        body: JSON.stringify({
          user1: {
            name: firstUser.name,
            reg_no: firstUser.reg_no,
            year,
          },
          user2: {
            name: secondUser.name,
            reg_no: secondUser.reg_no,
            year: year2,
          },
        }),
      });
      if (!(res.status === 200)) {
        console.log("Error in registering");
        ErrorNotify();
        setActiveStep(0);
        setFirstUser(() => {
          return {
            name: "",
            reg_no: "",
          };
        });
        setYear("2");
        setSecondUser(() => {
          return {
            name: "",
            reg_no: "",
          };
        });
        setMate("");
      } else {
        const dataBack = await res.json();
        console.log("second User Data-:", dataBack);
        const { data } = dataBack;
        userNotify(data);
        setMate("");
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleformoneRadio = (e) => {
    setformRadio(e.target.value);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setFirstUser({
      name: "",
      reg_no: "",
    });
    setSecondUser({
      name: "",
      reg_no: "",
    });
    setActiveStep(0);
  };
  const handleSkip = async (e) => {
    e.preventDefault();

    if (activeStep === 0) {
      const res = await fetch("/admin/double-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.admin}`,
        },
        body: JSON.stringify({
          name: firstUser.name,
          reg_no: firstUser.reg_no,
          year,
          mate,
        }),
      });
      if (!(res.status === 200)) {
        console.log("Error in registering");
        ErrorNotify();
        setFirstUser(() => {
          return {
            name: "",
            reg_no: "",
          };
        });
        setMate("");
        setYear("2");
        setActiveStep(0);
      } else {
        const dataBack = await res.json();
        const { data } = dataBack;
        console.log("User Data-:", data);
        userNotify(data);
        setFirstUser(() => {
          return {
            name: "",
            reg_no: "",
          };
        });
        setYear("2");
        setMate("");
      }
    }
    setActiveStep(0);
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
  const handleSecondUser = async (e) => {
    const { name, value } = e.target;
    setSecondUser((prev) => {
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
                  placeholder="Enter Full Name"
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  required
                  autoComplete="off"
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
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Roommate already present?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={handleformoneRadio}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="no"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {formRadio === "yes" ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="mate"
                      value={mate}
                      onChange={handleRoommate}
                      placeholder="Enter Room mate Registration Number"
                      label="Mate Reg_No"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    );
  };
  const formtwo = () => {
    return (
      <Card sx={{ mt: 2, mb: 2, boxShadow: 5 }}>
        <CardContent>
          <Typography gutterBottom variant="h5"></Typography>
          <form>
            <Grid container spacing={1}>
              <Grid xs={12} sm={6} item>
                <TextField
                  name="name"
                  value={secondUser.name}
                  onChange={handleSecondUser}
                  placeholder="Enter first name"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  autoComplete="off"
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
                    value={year2}
                    label="Year Of Study"
                    onChange={handleSecondYear}
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
                  value={secondUser.reg_no}
                  onChange={handleSecondUser}
                  type="text"
                  placeholder="Enter Students registration number"
                  label="reg_no"
                  variant="outlined"
                  fullWidth
                  required
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    );
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
            <h4>!! If Roommate is Absent Click the below submit button</h4>
            {/* Step {activeStep + 1} */}
            {activeStep === 0 ? <>{formone()}</> : <>{formtwo()}</>}
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
            {activeStep === 0 && formRadio === "no" && (
              <Button
                color="primary"
                variant="outlined"
                onClick={handleSkip}
                sx={{ mr: 1, fontSize: "20px" }}
              >
                Submit
              </Button>
            )}

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleNext}
                sx={{ fontSize: "20px" }}
                color="primary"
                variant="outlined"
              >
                Finish
              </Button>
            ) : (
              <>
                {formRadio === "no" ? (
                  <>
                    <Button
                      onClick={handleNext}
                      sx={{ fontSize: "20px" }}
                      color="primary"
                      variant="outlined"
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleSkip}
                      sx={{ fontSize: "20px" }}
                      color="primary"
                      variant="outlined"
                    >
                      Allocate Room
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
const RoomAlloc = () => {
  const [type, setType] = React.useState("double");
  const handleRadioChange = (e) => {
    setType(e.target.value);
  };
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
          <Header name="Room Allocation" />
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
                    Room Type
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="double"
                      control={<Radio />}
                      label="Double"
                    />
                    <FormControlLabel
                      value="single"
                      control={<Radio />}
                      label="Single"
                    />
                    <FormControlLabel
                      value="sheet"
                      control={<Radio />}
                      label="Upload Excel Sheet"
                    />
                  </RadioGroup>
                </FormControl>
                {type === "double" && (
                  <>
                    <HorizontalLinearStepper />
                  </>
                )}
                {type === "single" && <SingleRoom />}
                {type === "sheet" && <UploadFile />}
              </CardContent>
            </Card>
          </Container>
        </>
      </Box>
    </>
  );
};

export default RoomAlloc;
