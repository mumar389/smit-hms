import { Box, Card, Skeleton, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Display from "./Display";
import Header from "../Navigation/Header";
const AllReq = () => {
  const [loading, setLoading] = useState(true);
  const [cookie] = useCookies();
  const [requests, setReq] = useState([]);
  const getRequests = async (e) => {
    const res = await fetch("/admin/get-req", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (res.status === 301 || res.status === 302) {
      const resp = await res.json();
      const { message } = resp;
      console.log(message);
      setLoading(false);
    } else if (res.status === 200) {
      const response = await res.json();
      const { request } = response;
      // console.log(message,request);
      setReq(request);
      setLoading(false);
    } else {
      console.log("error");
      setLoading(true);
    }
  };

  useEffect(() => {
    getRequests();
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
        <Header name="Room Change Requests" />
      </Box>
      <>
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            top: "-5%",
          }}
        >
          <Card sx={{ opacity: 0.9, boxShadow: 5, width: "100%" }}>
            {loading ? (
              <>
                <Stack>
                  <Skeleton variant="rectangular" width="100%" height="100vh" />
                </Stack>
              </>
            ) : (
              <>
                {requests.length === 0 ? (
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
                      No Request Now!!
                    </Typography>
                  </>
                ) : (
                  <>
                    <Display requests={requests} />
                  </>
                )}
              </>
            )}
          </Card>
        </Container>
      </>
    </>
  );
};

export default AllReq;
