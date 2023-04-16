import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Card,
} from "@mui/material";
import { toast } from "react-toastify";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useCookies } from "react-cookie";
import { base } from "../../../url/url";

const errorNotify = (msg) => {
  toast.error(`${msg}`);
};
const sucessNotify = (msg) => {
  toast.success(`${msg}`);
};

const LeaveTable = (props) => {
  const { leaves } = props;
  const [cookie] = useCookies();
  // const navigate = useNavigate();

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
  const resolveLeave = async (id) => {
    const res = await fetch(`/wardens/approve-leave/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.warden}`,
      },
      body: JSON.stringify({
        status: "Approved",
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
      console.log(`${message}`);
      sucessNotify(message);
      // setInterval(() => {
      // }, 100);
      window.open(`${base}/warden/dashboard`, "_self");
    }
  };

  return (
    <>
      <Box>
        <Card sx={{ m: 2 }}>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sl No</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>from</TableCell>
                <TableCell>to</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Reg_No</TableCell>
                <TableCell>Parent Status</TableCell>
                <TableCell>Warden Status</TableCell>
                <TableCell>Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((comp, index) => (
                <TableRow key={comp._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{comp.reason}</TableCell>
                  <TableCell>{getDate(comp.from)}</TableCell>
                  <TableCell>{getDate(comp.to)}</TableCell>
                  <TableCell>{comp.user.name}</TableCell>
                  <TableCell>{comp.user.reg_no}</TableCell>
                  <TableCell>{comp.parentApproval}</TableCell>
                  <TableCell>{comp.wardenApproval}</TableCell>
                  {comp.wardenApproval === "Approved" ? (
                    <>
                      <TableCell></TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>
                        <TaskAltIcon
                          size="large"
                          onClick={(e) => {
                            e.preventDefault();
                            resolveLeave(comp._id);
                          }}
                        ></TaskAltIcon>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Box>
    </>
  );
};

export default LeaveTable;
