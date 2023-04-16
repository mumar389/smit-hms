import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../Navigation/Header";
import LeaveTable from "./LeaveTable";
import { useCookies } from "react-cookie";
import CurrentLeave from "./CurrentLeave";

const AllLeave = (props) => {
  const [leaves, setLeave] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies();
  const [show, setShow] = useState(true);
  const [leaveNo, setNumber] = useState("");
  const [cl, setCl] = useState({});
  const fetchComplains = async (e) => {
    setLoading(true);
    const res = await fetch("/admin/all-leave", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (!res.status === 200) {
      console.log("Error");
    } else {
      const databack = await res.json();
      const { data } = databack;
      // setInterval(() => {
      // }, 1000);
      setLeave((prev) => {
        return [...data];
      });
      setLoading(false);
    }
  };
  const handleNumberChange = (e) => {
    setNumber(e.target.value);
  };

  const getByNumber = async (e) => {
    console.log(leaveNo);
    const res = await fetch("/admin/leave-number", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
      body: JSON.stringify({
        leaveNo,
      }),
    });
    if (res.status === 301) {
      const resp = await res.json();
      const { message } = resp;
      console.log(message);
      setShow(true);
    } else if (res.status === 200) {
      const resp = await res.json();
      const { data } = resp;
      setCl(data);
      setShow(false);
    } else {
      console.log("Error");
      setShow(true);
    }
  };
  const getAll = () => {
    setShow(true);
  };
  useEffect(() => {
    fetchComplains();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box height={40}></Box>
      <Box
        sx={{
          height: "201px",
          backgroundColor: "#7BC4B2",
        }}
      >
        <Header name="Leave Requests" />
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
              opacity: 0.9,
              boxShadow: 5,
              backgroundColor: "#F8F8F8",
            }}
            className="form-design"
          >
            <CardContent>
              {loading ? (
                <>
                  <Stack>
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100vh"
                    />
                  </Stack>
                </>
              ) : leaves.length === 0 ? (
                <>
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      textAlign: "center",
                      justifyContent: "center",
                      height: "100vh",
                    }}
                  >
                    No Requests!!
                  </Typography>
                </>
              ) : (
                <>
                  <Box>
                    <TextField
                      margin="normal"
                      type={"text"}
                      required
                      id="number"
                      label="Leave Number"
                      name="number"
                      autoComplete="Leave No"
                      autoFocus
                      value={leaveNo}
                      onChange={handleNumberChange}
                    />
                    <Button
                      sx={{ m: 3 }}
                      onClick={getByNumber}
                      variant="contained"
                    >
                      Search
                    </Button>
                    <Button sx={{ m: 3 }} onClick={getAll} variant="contained">
                      Get All
                    </Button>
                  </Box>

                  {show ? (
                    <>
                      <LeaveTable leaves={leaves} />
                    </>
                  ) : (
                    <>
                      <CurrentLeave cl={cl} />
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </>
    </>
  );
};

export default AllLeave;
