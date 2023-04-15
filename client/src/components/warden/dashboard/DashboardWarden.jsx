import React from "react";
import Box from "@mui/material/Box";
import Header from "../Navigation/Header";
const Home = () => {
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
