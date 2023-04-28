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
// import {  useNavigate } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useCookies } from "react-cookie";
import { base } from "../../../url/url";
const errorNotify = (msg) => {
  toast.error(`${msg}`);
};
const sucessNotify = (msg) => {
  toast.success(`${msg}`);
};

const Display = (props) => {
  const { requests } = props;
  //, user, mate
  const [cookie] = useCookies();
  // const navigate = useNavigate();
  const handleApprove = async (id) => {
    const res = await fetch(`/admin/modify-req/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
      body: JSON.stringify({
        status: "Approved",
      }),
    });
    if (res.status === 301 || res.status === 302) {
      const resp = await res.json();
      const { message } = resp;
      errorNotify(message);
    } else if (res.status === 200) {
      const response = await res.json();
      const { message } = response;
      sucessNotify(message);
      // setInterval(() => {
      // }, 650);
      window.open(`${base}/admin/all-req`, "_self");
    } else {
      console.log("error");
      errorNotify("Please respond again");
      // setInterval(() => {
      //   window.open("http://localhost:3000/admin/all-req", "_self");
      // }, 650);
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
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>New Room No</TableCell>
                <TableCell>Segment</TableCell>
                <TableCell>Admin Status</TableCell>
                <TableCell>User Status</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((comp, index) => (
                <TableRow key={comp._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{comp.changeType}</TableCell>
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
                      sx={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleApprove(comp._id);
                      }}
                    >
                      Approve
                    </TaskAltIcon>
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
