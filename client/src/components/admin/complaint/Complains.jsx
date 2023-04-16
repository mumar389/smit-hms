// import styled from '@emotion/styled'
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
import ComplaintsTable from "./ComplaintsTable";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Complains = () => {
  const [complaints, setComplpaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies();
  const errorNotify = (msg) => {
    toast.error(`${msg}`);
  };
  const fetchComplains = async () => {
    setLoading(true);
    const res = await fetch("/admin/get-complain", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (!(res.status === 200)) {
      setLoading(false);
      // console.log("Error in fetching");
      errorNotify("Error in fetching")
    } else {
      const databack = await res.json();
      const { data } = databack;
      // setInterval(() => {
      // }, 650);
      setLoading(false);
      setComplpaints(data);
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
        <Header name="Complains" />
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
              ) : complaints.length === 0 ? (
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
                    No Complains Today!!
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{ textAlign: "center", mt: "5" }}
                  >
                    All Complains-:
                  </Typography>
                  <ComplaintsTable complaints={complaints} />
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </>
    </>
  );
};

export default Complains;
