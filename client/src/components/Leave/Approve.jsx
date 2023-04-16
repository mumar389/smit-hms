import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { base } from "../../url/url";

const Approve = () => {
  const ErrorNotify = (msg) => toast.error(`${msg}`);
  const SuccessNotify = (msg) => toast.success(`${msg}`);
  const params = useParams();
  const { id } = params;
  const [leave, setLeave] = useState({});
  const [loading, setLoading] = useState(true);
  const getRequest = async () => {
    const response = await fetch(`/leaves/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 301) {
      // console.log("unable to find leave");
      const res = await response.json();
      const { message } = res;
      ErrorNotify(message);
      setLoading(true);
    } else if (response.status === 200) {
      const res = await response.json();
      const { data } = res;
      // console.log("Data Back-:", data);
      setLeave(data);
      setLoading(false);
    } else {
      console.log("error");
      ErrorNotify("Error Please try again");
      setLoading(true);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const { name } = e.target;
    console.log("You clicked?", name);
    const res = await fetch(`/leaves/approve/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: name,
      }),
    });
    if (res.status === 301) {
      const response = await res.json();
      const { message } = response;
      ErrorNotify(message);
    } else if (res.status === 200) {
      const response = await res.json();
      const { message } = response;
      SuccessNotify(message);
      window.open(`${base}/leave/${id}`, "_self");
    } else {
      console.log("error");
      ErrorNotify("Error");
    }
  };

  useEffect(() => {
    getRequest();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "70rem",
        }}
      >
        <Box
          sx={{
            height: "201px",
            backgroundColor: "#7BC4B2",
          }}
        >
          <Typography
            sx={{
              position: "relative",
              width: "50%",
              height: "20px",
              left: "100px",
              top: "50px",
              fontFamily: "Inter",
              fontStyle: "normal",
              fontHeight: "600",
              fontSize: "40px",
              lineHeight: "30px",
              color: "#FFFFFF",
            }}
          >
            Approve Leave
          </Typography>
        </Box>
        <>
          <Container
            maxWidth="lg"
            sx={{
              position: "relative",
              top: "-5%",
              left: "10%",
              backgroundColor: "F7F7F7",
            }}
          >
            <Card
              sx={{
                width: "100%",
                height: "70vh",
                opacity: 0.9,
                boxShadow: 5,
                backgroundColor: "#F8F8F8",
              }}
            >
              <CardContent
                sx={{ textAlign: "center", justifyContent: "center" }}
              >
                {loading ? (
                  <>
                    <Stack>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="50vh"
                      />
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      Leave Request
                    </Typography>
                    <Typography variant="h5">
                      Leave Number-:{leave.leaveNo}
                    </Typography>
                    <Typography variant="h5">
                      Student Name-:{leave.user.name}
                    </Typography>
                    <Typography variant="h5">
                      Leave From-:{leave.from}
                    </Typography>
                    <Typography variant="h5">To-:{leave.to}</Typography>
                    <Typography variant="h5">
                      Reason For Leaving-:{leave.reason}
                    </Typography>
                    <Typography variant="h5">
                      Approval Status-:{leave.parentApproval}
                    </Typography>
                    {leave.parentApproval !== "Approved" && (
                      <ButtonGroup
                        color="primary"
                        variant="contained"
                        aria-label="medium secondary button group"
                        onClick={handleClick}
                      >
                        <Button sx={{ m: 1 }} key="one" name="Approved">
                          Approve leave
                        </Button>
                        <Button sx={{ m: 1 }} key="two" name="Not Approved">
                          Reject leave
                        </Button>
                      </ButtonGroup>
                    )}
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

export default Approve;
