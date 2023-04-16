import {
  Box,
  Card,
  CardContent,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../Navigation/Header";
import LeaveTable from "./LeaveTable";
import { useCookies } from "react-cookie";

const LeaveReq = (props) => {
  const [leaves, setLeave] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies();
  const {warden}=props;
  const fetchComplains = async () => {
    setLoading(true);
    const res = await fetch("/wardens/all-req", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${cookie.warden}`,
      },
    });
    if (!(res.status === 200)) {
      setLoading(false);
      console.log("Error in fetching");
    } else {
      const databack = await res.json();
      const { data } = databack;
      setLeave(data);
      setLoading(false);
    }
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
                    No Leave Found!!
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{ textAlign: "center", mt: "5" }}
                  >
                    All Leaves-:
                  </Typography>
                  <LeaveTable leaves={leaves} warden={warden}/>
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </>
    </>
  );
};

export default LeaveReq;
