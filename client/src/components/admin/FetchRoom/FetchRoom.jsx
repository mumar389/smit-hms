import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  // FormLabel,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useState } from "react";
import Header from "../Navigation/Header";
import AllRoom from "./AllRoom";
import { useCookies } from "react-cookie";

const FetchRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [cookie] = useCookies();
  const [floor, setFloor] = React.useState(1);
  const [segment, setSeg] = React.useState("A");
  const [loading, setLoading] = useState(true);
  const [results, setRes] = useState({});
  const handleChange = (event) => {
    setFloor(event.target.value);
  };

  const handleSeg = (e) => {
    setSeg(e.target.value);
  };
  const getRoom = async (e) => {
    setLoading(true);
    const res = await fetch("/admin/get-rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
      body: JSON.stringify({
        floor,
        segment,
      }),
    });
    if (res.status === 301 || res.status === 422) {
      console.log("Error");
    } else if (res.status === 200) {
      const response = await res.json();
      const { data } = response;
      // console.log("Got Rooms-:", data);
      setRooms(data);
    } else {
      console.log("Error");
    }
  };

  const getDetails = async (rid) => {
    const response = await fetch(`/admin/get-details/${rid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (response.status === 301) {
      console.log("error");
      setLoading(true);
    } else if (response.status === 200) {
      const res = await response.json();
      const { data } = res;
      setLoading(false);
      setRes(data);
    } else {
      setLoading(true);
    }
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
          <Header name="Rooms" />
        </Box>
        <>
          <Container
            maxWidth="lg"
            sx={{
              position: "relative",
              top: "-5%",
              width: "100%",
            }}
          >
            <Card
              sx={{
                opacity: 0.9,
                boxShadow: 5,
                height: "100vh",
                backgroundColor: "#F8F8F8",
              }}
              className="form-design"
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ textAlign: "left", mt: "5" }}
                >
                  Filter Room
                </Typography>
                <Box
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <FormControl sx={{ width: "20%" }}>
                    <InputLabel id="demo-simple-select-label">Floor</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={floor}
                      label="Age"
                      onChange={handleChange}
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
                  <FormControl sx={{ width: "20%", m: 2 }}>
                    <InputLabel id="demo-simple-select-label">
                      Segment
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={segment}
                      label="Age"
                      onChange={handleSeg}
                    >
                      <MenuItem value={"A"}>A</MenuItem>
                      <MenuItem value={"B"}>B</MenuItem>
                      <MenuItem value={"C"}>C</MenuItem>
                      <MenuItem value={"D"}>D</MenuItem>
                      <MenuItem value={"E"}>E</MenuItem>
                      <MenuItem value={"F"}>F</MenuItem>
                      <MenuItem value={"G"}>G</MenuItem>
                      <MenuItem value={"H"}>H</MenuItem>
                      <MenuItem value={"I"}>I</MenuItem>
                    </Select>
                  </FormControl>
                  <Button onClick={getRoom} variant="outlined">
                    Search
                  </Button>
                </Box>
                <Box>
                  {rooms.length === 0 ? (
                    <></>
                  ) : (
                    <>
                      <Box sx={{ display: "flex", mt: 2 }}>
                        {rooms.map((currentRoom, index) => {
                          return (
                            <>
                              <AllRoom
                                key={index}
                                rooms={currentRoom}
                                details={getDetails}
                              />
                            </>
                          );
                        })}
                      </Box>
                    </>
                  )}
                </Box>
                {loading ? (
                  <></>
                ) : (
                  <>
                    <Typography variant="h3">Room Details-:</Typography>
                    <Box sx={{ m: 3 }}>
                      <Box>
                        <Typography variant="h5">
                          {" "}
                          Status-:{results.status}
                        </Typography>
                        <Typography variant="h5">
                          {" "}
                          Allocation Type-:{results.type}
                        </Typography>
                        {results.user1 !== null && (
                          <>
                            <Typography variant="h5">
                              Student Name-: {results.user1.name}
                            </Typography>
                            <Typography variant="h5">
                              {" "}
                              Reg_No-: {results.user1.reg_no}
                            </Typography>
                            <Typography variant="h5">
                              Year-: {results.user1.year}
                            </Typography>
                          </>
                        )}
                        {results.user2 !== null && (
                          <>
                            <Typography variant="h5">
                              Student Name-: {results.user2.name}
                            </Typography>
                            <Typography variant="h5">
                              {" "}
                              Reg_No-:{results.user2.reg_no}
                            </Typography>
                            <Typography variant="h5">
                              Year-: {results.user2.year}
                            </Typography>
                          </>
                        )}
                        <Typography variant="h5">
                          Student Count-: {results.personCount}
                        </Typography>
                        <Typography variant="h5">
                          Warden Name-: {results.warden.name}
                        </Typography>
                        <Typography variant="h5">
                          Warden Contact-: {results.warden.contact}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Container>
        </>
      </Box>
    </>
  );
};

export default FetchRoom;
