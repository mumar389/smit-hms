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
import { useNavigate } from "react-router-dom";
import HeaderUsers from "../Navigation/HeaderUsers";
import Display from "./Display";

const GetComplain = (props) => {
  const [cookie] = useCookies();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [complain, setComplains] = useState([]);
  const id = props.user.id;
  const getComplains = async (e) => {
    setLoading(true);
    const res = await fetch("/users/fetch-complain", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
    });
    if (!(res.status === 200)) {
      console.log("error in fetching the complains");
      navigate("/users/");
    } else {
      const data = await res.json();
      const { complains } = data;
      setComplains((prev) => {
        return [...complains];
      });
      // setTimeout(() => {
      // }, 650);
      setLoading(false);
    }
  };

  useEffect(() => {
    getComplains();
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
        <HeaderUsers name="All Complain" />
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
                  <Skeleton variant="rectangular" width="100%" height="100vh" />
                </Stack>
              </>
            ) : (
              <>
                {complain.length === 0 ? (
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
                      No Complains!!
                    </Typography>
                  </>
                ) : (
                  <>
                    <Display uid={id} complain={complain} />
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

export default GetComplain;
