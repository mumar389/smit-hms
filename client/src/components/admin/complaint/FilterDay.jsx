import React from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";

const FilterDay = (props) => {
  const [day, setDay] = React.useState("All");

  const handleChange = (event) => {
    setDay(event.target.value);
    props.getDay(event.target.value);
    // console.log("This is getting submitted");
  };

  return (
    <Box sx={{ width: "10%", ml: 1 }}>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-simple-select-label">Day</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={day}
          label="Day"
          onChange={handleChange}
          type="submit"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Today">Today</MenuItem>
          <MenuItem value="Previous">Previous</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterDay;
