import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Box, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";

const UploadFile = () => {
  const ErrorNotify = (msg) => toast.error(`${msg}`);
  const SuccessNotify = (msg) => toast.success(`${msg}`);

  const [file, setFile] = useState(null);
  const [cookie] = useCookies();
  const [loading, setLoad] = useState(false);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cookie.admin}`,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const data = new FormData();
    data.append("file", file);
    // console.log("Front", data);
    try {
      const res = await axios.post("/admin/handle-file", data, headers);
      if (res.status === 301 || res.status === 302) {
        setLoad(false);
        ErrorNotify("error");
      } else if (res.status === 200) {
        setLoad(false);
        SuccessNotify("Registration and allocation successfull");
        setFile(null);
      } else {
        setLoad(false);
        ErrorNotify("Error");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              position: "relative",
              left: "10%",
              opacity: 0.85,
            }}
          >
            <CircularProgress size={30} />
          </Box>
        </>
      ) : (
        <></>
      )}
      <Box sx={{ m: 2, color: "black", fontFamily: "bolder" }}>
        <Typography>Must Include the below mentioned columns!!</Typography>
        <Typography>Column-: Name,Registration_Number,Year</Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <div>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".xls, .xlsx"
            />
            <button type="submit">Upload Excel Sheet</button>
          </form>
        </div>
      </Box>
    </>
  );
};

export default UploadFile;
