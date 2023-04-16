import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

import FilterComplaints from "./FilterComplaints";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useCookies } from "react-cookie";
import { base } from "../../../url/url";
// import styled from "@emotion/styled";
const errorNotify = (msg) => {
  toast.error(`${msg}`);
};
const sucessNotify = (msg) => {
  toast.success(`${msg}`);
};
const ComplaintsTable = (props) => {
  const { complaints } = props;
  const [cookie] = useCookies();
  const [val, setVal] = useState(complaints);

  const getDate = (givenDate) => {
    const newDate = new Date(givenDate);
    const yyyy = newDate.getFullYear();
    let mm = newDate.getMonth() + 1; // Months start at 0!
    let dd = newDate.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedDate = dd + "/" + mm + "/" + yyyy;
    return formattedDate;
  };

  //resolving the complain -:
  const resolveComplain = async (id) => {
    const res = await fetch(`/admin/resolve-complain/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
      body: JSON.stringify({
        status: "Resolved",
      }),
    });
    if (res.status === 501) {
      console.log("Error");
      let msg = "Error in resolving complain";
      errorNotify(msg);
    } else if (res.status === 301 || res.status === 302 || res.status === 303) {
      const response = await res.json();
      const { message } = response;
      errorNotify(message);
    } else {
      const response = await res.json();
      const { message } = response;
      sucessNotify(message);
      // setInterval(() => {
      // }, 650);
      window.open(`${base}/admin/complains`, "_self");

    }
  };

  const setComplain = (com) => {
    setVal(com);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <FilterComplaints complaints={complaints} setComplain={setComplain} />

      {/* <Card sx={{ m: 2,backgroundColor:'#F8F8F8',height:'70vh' }}> */}
      <Table sx={{ width: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sl No</TableCell>
            <TableCell> Date</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Room Number</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>User Status</TableCell>
            <TableCell>Response</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {val.map((complain, index) => (
            <TableRow key={complain._id} sx={{ backgroundColor: "#FDFFFE" }}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{getDate(complain.pref_resolution_date)}</TableCell>
              <TableCell>{complain.user.name}</TableCell>
              <TableCell>
                {complain.room.segment}-{complain.room.number}
              </TableCell>
              <TableCell>{complain.type}</TableCell>
              <TableCell>{complain.desc}</TableCell>
              <TableCell>{complain.user_response.status}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={(e) => {
                    e.preventDefault();
                    resolveComplain(complain._id);
                  }}
                >
                  <TaskAltIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </Card> */}
    </Box>
  );
};

export default ComplaintsTable;

//sx={{backgroundColor:'#FDFFFE'}}
