import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../Navigation/Header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import UnreadNotify from "./UnreadNotify";
import ReadNotify from "./ReadNotify";
import { useCookies } from "react-cookie";
import { base } from "../../../url/url";

const Notify = (props) => {
  const { socket } = props;
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //getting the notifications from api
  const [read, setRead] = useState([]);
  const [unread, setUnread] = useState([]);
  const [cookie] = useCookies();
  const getNotify = async () => {
    const res = await fetch("/admin/get-notify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (res.status === 301) {
      console.log("Error");
    } else if (res.status === 200) {
      const resp = await res.json();
      const { unread, read } = resp;
      setUnread(unread);
      setRead(read);
    } else {
      console.log("Error");
    }
  };
  //mark as read Notification-:
  const handleNotify = async (e) => {
    e.preventDefault();
    const res = await fetch("/admin/mark-notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (res.status === 301) {
      console.log("error");
    } else if (res.status === 200) {
      const resp = await res.json();
      const { message } = resp;
      console.log(message);
      window.open(`${base}/admin/notify-page`, "_self");
    } else {
      console.log("Error");
    }
  };
  //deleting the Notifcations
  const deleteNotify = async (e) => {
    e.preventDefault();
    const res = await fetch("/admin/delete-notify", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (res.status === 301) {
      console.log("error");
    } else if (res.status === 200) {
      const resp = await res.json();
      const { message } = resp;
      console.log(message);
      // navigate('/admin/notify-page');
      window.open(`${base}/admin/notify-page`, "_self");
    } else {
      console.log("Error");
    }
  };

  useEffect(() => {
    socket.on("recv-notify", (data) => {
      getNotify();
    });
    getNotify();
    // eslint-disable-next-line
  }, [socket]);
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
          <Header name="Notifications-:" />
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
                opacity: 0.8,
                boxShadow: 5,
                height: "100vh",
                backgroundColor: "#F8F8F8",
              }}
              className="form-design"
            >
              <CardContent>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      centered
                    >
                      <Tab label="Unread" {...a11yProps(0)} />
                      <Tab label="Read" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    {unread.length === 0 ? (
                      <>No New Notification</>
                    ) : (
                      <>
                        <Button
                          sx={{ position: "relative", left: "80%" }}
                          onClick={handleNotify}
                        >
                          Mark All As Read
                        </Button>
                        {unread.map((currentNotify, index) => {
                          return (
                            <>
                              <UnreadNotify
                                key={currentNotify._id}
                                notify={currentNotify}
                                index={index}
                              />
                            </>
                          );
                        })}
                      </>
                    )}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {read.length === 0 ? (
                      <>No Read Notification</>
                    ) : (
                      <>
                        <Button
                          sx={{ position: "relative", left: "80%" }}
                          onClick={deleteNotify}
                        >
                          Delete All Notifications
                        </Button>
                        {read.map((rn, i) => {
                          return (
                            <ReadNotify key={rn._id} index={i} notify={rn} />
                          );
                        })}
                      </>
                    )}
                  </TabPanel>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </>
      </Box>
    </>
  );
};

export default Notify;
