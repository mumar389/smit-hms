import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Card,
  // IconButton,
  // Button,
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
  const { requests, user } = props;
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const handleApprove = async (id) => {
    let desc = window.prompt("Enter desc if any");
    const res = await fetch(`/users/modify-request/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
      body: JSON.stringify({
        status: "Approved",
        desc,
      }),
    });
    if (res.status === 301) {
      const resp = await res.json();
      const { message } = resp;
      errorNotify(message);
    } else if (res.status === 200) {
      const response = await res.json();
      const { message } = response;
      sucessNotify(message);
      // setInterval(() => {
      // }, 650);
      // window.open(`${base}/users/get-request`);
      navigate("/users/");
    } else {
      console.log("error");
      errorNotify("Please respond again");
      // setInterval(() => {

      // }, 650);
      // window.open(`${base}/users/get-request-page`);
      navigate("/users/");
    }
  };
  const handleDeleteRequest = async (id) => {
    const res = await fetch(`/users/delete-request/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
    });
    if (res.status === 422 || res.status === 301) {
      console.log("Eror");
      const resp = await res.json();
      const { message } = resp;
      errorNotify(message);
    } else if (res.status === 200) {
      console.log("Deleted successfully");
      const resp = await res.json();
      const { message } = resp;
      sucessNotify(message);
      // setInterval(() => {
      // }, 650);
      navigate("/users/");
    } else {
      console.log("Error");
      errorNotify("Error,, try again!!");
      // setInterval(() => {
      // }, 650);
      // window.open(`${base}/users/get-request-page`, "_self");
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
                <TableCell>Reason</TableCell>
                <TableCell>New Room No</TableCell>
                <TableCell>Segment</TableCell>
                <TableCell>Admin Status</TableCell>
                <TableCell>User Status</TableCell>
                <TableCell>Response</TableCell>
                <TableCell>Clear</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((comp, index) => (
                <TableRow key={comp._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{comp.reason}</TableCell>
                  {comp.changeType === "Swap" ? (
                    <>
                      <TableCell>{comp.swapRoom.number}</TableCell>
                      <TableCell>{comp.swapRoom.segment}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{comp.newDetails.rno}</TableCell>
                      <TableCell>{comp.newDetails.segment}</TableCell>
                    </>
                  )}
                  <TableCell>{comp.adminApproval}</TableCell>
                  {comp.studentApproval.length === 0 ? (
                    <>
                      <TableCell>Not Approved</TableCell>
                    </>
                  ) : (
                    <>
                      {/* {comp.studentApproval.map((c, i) => {
                        return <TableCell>{c.status}</TableCell>;
                      })} */}
                      <TableCell>{comp.studentApproval[0].status}</TableCell>
                    </>
                  )}

                  <TableCell>
                    <TaskAltIcon
                      onClick={(e) => {
                        e.preventDefault();
                        handleApprove(comp._id);
                      }}
                    >
                      Approve
                    </TaskAltIcon>
                  </TableCell>

                  {comp.requestBy === user.id ? (
                    <>
                      <TableCell>
                        <ClearIcon
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteRequest(comp._id);
                          }}
                        />
                      </TableCell>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* <TableCell>{comp.status}</TableCell> */}
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
