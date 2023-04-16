import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Card,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useCookies } from "react-cookie";
import ClearIcon from "@mui/icons-material/Clear";
// import { base } from "../../../url/url";

const errorNotify = (msg) => {
  toast.error(`${msg}`);
};
const sucessNotify = (msg) => {
  toast.success(`${msg}`);
};

const Display = (props) => {
  const { complain, uid } = props;
  const [cookie] = useCookies();
  const navigate = useNavigate();

  // console.log("Id-:", uid);
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
  //resolving the complain-:
  const resolveComplain = async (id) => {
    const res = await fetch(`/users/update-complain/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
      body: JSON.stringify({
        status: "Resolved",
      }),
    });
    if (res.status === 501) {
      // console.log("Failed to resove complain");
      let msg = "Failed to resove complain";
      errorNotify(msg);
    } else if (res.status === 422 || res.status === 301 || res.status === 302) {
      const { message } = await res.json();
      // console.log(`${message}`);
      errorNotify(message);
    } else {
      const { message } = await res.json();
      // console.log(`${message}`);
      sucessNotify(message);
      // setInterval(() => {
      // }, 100);
      navigate("/users/");
    }
  };

  const deleteComplain = async (id) => {
    const res = await fetch(`/users/delete-complain/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
    });
    if (res.status === 501) {
      // console.log("Failed to resove complain");
      let msg = "Failed to resove complain";
      errorNotify(msg);
    } else if (res.status === 422 || res.status === 301) {
      const { message } = await res.json();
      // console.log(`${message}`);
      errorNotify(message);
    } else {
      const { message } = await res.json();
      // console.log(`${message}`);
      sucessNotify(message);
      // setInterval(() => {
      // }, 100);
      // window.open(`${base}/users/get-complains`, "_self");
      navigate("/users/");
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <Card sx={{ m: 2 }}>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sl No</TableCell>
                <TableCell>Resolution Date</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Room Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Your Status</TableCell>
                <TableCell>Admin Stat</TableCell>
                <TableCell>Response</TableCell>
                <TableCell>Clear</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complain.map((comp, index) => (
                <TableRow key={comp._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{getDate(comp.pref_resolution_date)}</TableCell>
                  <TableCell>{comp.user.name}</TableCell>
                  <TableCell>
                    {comp.room.segment}-{comp.room.number}
                  </TableCell>
                  <TableCell>{comp.type}</TableCell>
                  <TableCell>{comp.desc}</TableCell>
                  <TableCell>{comp.user_response.status}</TableCell>
                  <TableCell>{comp.status}</TableCell>
                  {comp.status === "Resolved" ? (
                    <>
                      <TableCell></TableCell>
                    </>
                  ) : (
                    <>
                      {uid === comp.user._id ? (
                        <>
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              size="large"
                              onClick={(e) => {
                                e.preventDefault();
                                resolveComplain(comp._id);
                              }}
                            >
                              <TaskAltIcon />
                            </IconButton>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell></TableCell>
                        </>
                      )}
                    </>
                  )}
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteComplain(comp._id);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </>
  );
};

export default Display;
