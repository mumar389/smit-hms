import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import HeaderUsers from "../Navigation/HeaderUsers";

const User = (props) => {
  const { user, mate, assigned, type } = props;
  const WarningNotify = () =>
    toast.warning("Please update your password to be secure");

  useEffect(() => {
    if (user.v === 0) {
      WarningNotify();
    }
    // eslint-disable-next-line
  }, [user.v]);
  return (
    <>
      <Box height={40} />
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
          <HeaderUsers name="Home" />
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
              opacity: 0.85,
              boxShadow: 5,
            }}
            className="form-design"
          >
            <CardContent>
              <Typography variant="h3">Hello :{user.name}</Typography>
              <br />
              <h2>Registration Number-:{user.reg_no}</h2>
              <h2>
                 Room -:{user.segment}-{user.roomNumber}
              </h2>
              <h2>
                <p>Warden Details-:</p>
                <p>Name-:{user.wardenName}</p>
                <p>Contact-:{user.wardenNumber}</p>
              </h2>
           
              {assigned ? (
                <>
                  <h2>Your RoomMate name is-:{mate.roomMateName}</h2>
                  <h2>
                    Your Roommate Registration Number is-:{mate.roomMateReg_no}
                  </h2>
                </>
              ) : type === "Double" ? (
                <>
                  <h1>Room Mate is not assigned yet!</h1>
                </>
              ) : (
                type === "Single" && (
                  <>
                    <h3>Single Room Allotted</h3>
                  </>
                )
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default User;

/*
  <h2>Your Room is-:{room.segment}-{user.roomNumber}</h2>
              {assigned ? (
                <>
                  <h2>Your RoomMate name is-:{room.roomMateName}</h2>
                  <h2>
                    Your Roommate Registration Number is-:{room.roomMateReg_no}
                  </h2>
                </>
              ) : (
                <>
                  <h1>Room Mate is not assigned yet!</h1>
                </>
              )}

*/
