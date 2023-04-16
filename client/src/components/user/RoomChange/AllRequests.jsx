import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import HeaderUsers from "../Navigation/HeaderUsers";
import Display from "./Display";
import { toast } from "react-toastify";

const errorNotify = (msg) => {
  toast.error(`${msg}`);
};
const AllRequests = ({ user, mate }) => {
  const [loading, setLoading] = useState(true);
  const [cookie] = useCookies();
  const [requests, setReq] = useState([]);
  const getRequests = async (e) => {
    const res = await fetch("/users/get-request", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
    });
    if (res.status === 301 || res.status === 302) {
      const resp = await res.json();
      const { message } = resp;
      errorNotify(message);
      setLoading(false);
    } else if (res.status === 200) {
      const response = await res.json();
      const { request } = response;
      setReq(request);
      setLoading(false);
    } else {
      console.log("error");
      errorNotify("Error please try again");
      setLoading(true);
    }
  };

  useEffect(() => {
    getRequests();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box height={40} />
      <Box
        sx={{
          height: "201px",
          backgroundColor: "#7BC4B2",
        }}
      >
        <HeaderUsers name="All Requests" />
      </Box>
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
                  <Skeleton variant="rectangular" width="100%" height="70vh" />
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
                        height: "70vh",
                      }}
                    >
                      You dont have any Requests!!
                    </Typography>
                  </>
                ) : (
                  <>
                    <Display requests={requests} user={user} mate={mate} />
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default AllRequests;
