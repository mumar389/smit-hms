import React, { useState } from "react";
import FilterDay from "./FilterDay";

import { Box } from "@mui/material";
import FilterType from "./FilterType";

const FilterComplaints = (props) => {
  const { complaints } = props;
  let [todayComplain, setToday] = useState([]);
  let [previousComplain, setPrevious] = useState([]);
  const [type, setType] = useState("All");
  const [electric, setElectric] = useState([]);
  const [carpentary, setCarpent] = useState([]);
  const [sanitary, setSanitary] = useState([]);

  const [day, seDay] = useState("All");
  //date formatting function
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
  //getting day from child complain-:
  const setDay = (day) => {
    const check = (c) => {
      let userFullDate = getDate(c.pref_resolution_date);
      let userDD = `${userFullDate[0]}${userFullDate[1]}`;
      let date = new Date();
      let currentDate = getDate(date);
      let cd = `${currentDate[0]}${currentDate[1]}`;
      if (userDD === cd) {
        return c;
      }
    };
    const prevCheck = (c) => {
      let userFullDate = getDate(c.pref_resolution_date);
      let userDD = `${userFullDate[0]}${userFullDate[1]}`;
      let date = new Date();
      let currentDate = getDate(date);
      let cd = `${currentDate[0]}${currentDate[1]}`;
      if (userDD < cd) {
        return c;
      }
    };
    const todayComp = complaints.filter(check);
    setToday(todayComp);
    const prevComp = complaints.filter(prevCheck);
    setPrevious(prevComp);
    seDay(day);
  };
  //getting type from child component-: filterType
  const getType = (type) => {
    setType(type);
    if (day === "Today") {
      todayComplain.map((c) => {
        if (c.type === "Electrical Complain") {
          setElectric([c]);
        } else if (c.type === "Sanitary Complain") {
          setSanitary([c]);
        } else if (c.type === "Carpentry Complain") {
          setCarpent([c]);
        }
        return {};
      });
    } else if (day === "Previous") {
      previousComplain.map((c) => {
        if (c.type === "Electrical Complain") {
          setElectric([c]);
        } else if (c.type === "Sanitary Complain") {
          setSanitary([c]);
        } else if (c.type === "Carpentry Complain") {
          setCarpent([c]);
        }
        return {};
      });
    } else {
      complaints.map((c) => {
        if (c.type === "Electrical Complain") {
          setElectric([c]);
        } else if (c.type === "Sanitary Complain") {
          setSanitary([c]);
        } else if (c.type === "Carpentry Complain") {
          setCarpent([c]);
        }
        return {};
      });
    }
  };
  if (day === "Today") {
    if (type === "Electrical Complain") {
      props.setComplain(electric);
    } else if (type === "Sanitary Complain") {
      props.setComplain(sanitary);
    } else if (type === "Carpentry Complain") {
      props.setComplain(carpentary);
    } else {
      props.setComplain(todayComplain);
    }
  } else if (day === "Previous") {
    if (type === "Electrical Complain") {
      props.setComplain(electric);
    } else if (type === "Sanitary Complain") {
      props.setComplain(sanitary);
    } else if (type === "Carpentry Complain") {
      props.setComplain(carpentary);
    } else {
      props.setComplain(previousComplain);
    }
  } else {
    if (type === "Electrical Complain") {
      props.setComplain(electric);
    } else if (type === "Sanitary Complain") {
      props.setComplain(sanitary);
    } else if (type === "Carpentry Complain") {
      props.setComplain(carpentary);
    } else {
      props.setComplain(complaints);
    }
  }

  return (
    <Box sx={{ m: 2 }}>
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="flex-end"
      >
        <FilterDay getDay={setDay} />
        <FilterType getType={getType} />
      </Box>
    </Box>
  );
};

export default FilterComplaints;
