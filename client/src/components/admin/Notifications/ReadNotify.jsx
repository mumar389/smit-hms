import { Card } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const ReadNotify = (props) => {
  const { index, notify } = props;
  return (
    <>
      <Box sx={{ m: 2, fontSize: "30px" }}>
        <Card>
          <p>
            {index + 1}. {notify.desc} by &nbsp;
            {notify.userName}
          </p>
        </Card>
      </Box>
    </>
  );
};

export default ReadNotify;
