import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

const CurrentLeave = (props) => {
  const { cl } = props;
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
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
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>{cl.leaveNo}</TableCell>
            <TableCell>{cl.reason}</TableCell>
            <TableCell>{cl.from}</TableCell>
            <TableCell>{cl.to}</TableCell>
            <TableCell>{cl.user.name}</TableCell>
            <TableCell>{cl.user.reg_no}</TableCell>
            <TableCell>{cl.parentApproval}</TableCell>
            <TableCell>{cl.wardenApproval}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default CurrentLeave;
