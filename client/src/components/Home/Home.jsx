import React from "react";
// import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { Box } from "@mui/material";
import home_page from "../../assets/images/home_page.jpg";

const Home = () => {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          backgroundImage: `url(${home_page})`,
          backgroundSize: "cover",
          overflow: "hidden",
          opacity: 1,
        }}
      ></Box>
    </>
  );
};

export default Home;

/*

  <Box sx={{ m: 1,position:'relative' }}>
          <Card
            sx={{  height: "50vh", width: "50%",left:'100px' }}
          ></Card>
        </Box>
*/
