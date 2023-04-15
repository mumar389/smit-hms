import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
// import {  Typography } from '@mui/material';
// import dashboard_img1 from "../../../assets/images/dashboard_img1.png";
// import dashboard_img2 from "../../../assets/images/dashboard_img2.png";
import { PieChart } from "react-minimal-pie-chart";

import Header from "../Navigation/Header";
import CircularProgress from "@mui/material/CircularProgress";
import { useCookies } from "react-cookie";
const Home = () => {
  const [cookie] = useCookies();
  const [loading, setLoad] = useState(true);
  const [allData, setAllData] = useState([]);
  const getData = async () => {
    setLoad(true);
    const res = await fetch("/admin/dashboard-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (!(res.status === 200)) {
    } else {
      const resp = await res.json();
      const { data } = resp;
      setAllData(data);
      setLoad(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

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
          <Header name="Dashboard" />
          {loading ? (
            <>
              <Box sx={{ display: "flex", height: "100%" }}>
                <CircularProgress />
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  position: "relative",
                  height: "300px",
                  border: "2px ",
                  top: "60%",
                  width: "25%",
                  left: "10%",
                  backgroundColor: "",
                }}
              >
                <PieChart
                  data={[
                    { title: "One", value: allData[0], color: "green" },
                    { title: "Two", value: allData[1], color: "red" },
                  ]}
                />
                <Box
                  component="div"
                  sx={{
                    border: "2px solid gray",
                    width: "8%",
                    height: "7%",
                    backgroundColor: "red",
                  }}
                >
                  <p style={{ left: "10%" }}>Unavailable Rooms</p>
                </Box>
                <Box
                  sx={{
                    ml: 12,
                    border: "2px solid gray",
                    width: "8%",
                    height: "7%",
                    backgroundColor: "green",
                    mt: -2.5,
                  }}
                >
                  <p>Available Rooms</p>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Home;

/*
 <img
            style={{
              position: "relative",
              left: "60px",
              top: "100px",
            }}
            height={"auto"}
            width={"50%"}
            src={dashboard_img1}
            alt="Not Found"
          />
          <img
            style={{
              position: "relative",
              left: "80px",
              top: "100px",
            }}
            height={"185%"}
            width={"30%"}
            src={dashboard_img2}
            alt="Not Found"
          />
*/
