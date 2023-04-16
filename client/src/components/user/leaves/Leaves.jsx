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
import HeaderUsers from "../Navigation/HeaderUsers";
import LeaveTable from "./LeaveTable";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const errorNotify = (msg) => {
  toast.error(`${msg}`);
};
const Leaves = (props) => {
  const [leaves, setLeave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookie] = useCookies();
  const { user } = props;
  const fetchComplains = async () => {
    setLoading(true);
    const res = await fetch("/users/get-leave", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
    });
    if (res.status === 301) {
      console.log("Error");
      const databack = await res.json();
      const { message } = databack;
      errorNotify(message);
      setLoading(true);
    } else if (res.status === 200) {
      const databack = await res.json();
      const { data } = databack;
      setLeave((prev) => {
        return [...data];
      });
      setLoading(false);
    } else {
      console.log("Error");
      errorNotify("Error in finding please try again");
      setLoading(true);
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
        <HeaderUsers name="Leave Requests" />
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
                  <LeaveTable leaves={leaves} user={user} />
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </>
    </>
  );
};

export default Leaves;
