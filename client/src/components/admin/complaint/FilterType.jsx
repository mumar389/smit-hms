import React from "react";
import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";

const FilterType = (props) => {
  const [type, setType] = React.useState("All");

  const handleChange = (event) => {
    setType(event.target.value);
    props.getType(event.target.value);
    // console.log("This is getting submitted");
  };
  return (
    <Box sx={{ width: "10%", ml: 1 }}>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="Day"
          onChange={handleChange}
          type="submit"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Electrical Complain">Electrical</MenuItem>
          <MenuItem value="Sanitary Complain">Sanitary</MenuItem>
          <MenuItem value="Carpentry Complain">Carpentary</MenuItem>
          {/* <MenuItem value="Sanitary">Sanitary</MenuItem> */}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterType;
