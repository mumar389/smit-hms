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

const LeaveTable = (props) => {
  const { leaves } = props;
  // const navigate = useNavigate();

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
                <TableCell>Leave No</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>from</TableCell>
                <TableCell>to</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Reg_No</TableCell>
                <TableCell>Parent Status</TableCell>
                <TableCell>Warden Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.map((comp, index) => (
                <TableRow key={comp._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{comp.leaveNo}</TableCell>
                  <TableCell>{comp.reason}</TableCell>
                  <TableCell>{getDate(comp.from)}</TableCell>
                  <TableCell>{getDate(comp.to)}</TableCell>
                  <TableCell>{comp.user.name}</TableCell>
                  <TableCell>{comp.user.reg_no}</TableCell>
                  <TableCell>{comp.parentApproval}</TableCell>
                  <TableCell>{comp.wardenApproval}</TableCell>
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
