import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { base } from "../../url/url";
const AuthUser = (props) => {
  const navigate = useNavigate();
  const { Component } = props;
  const [cookie] = useCookies();
  // const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "",
    reg_no: "",
    wardenName: "",
    wardenNumber: 0,
    v: -1,
    roomNumber: 0,
    segment: "",
  });
  const [type, setType] = useState("");
  const [roomMate, setMate] = useState({
    id: "",
    roomMateName: "",
    roomMateReg_no: "",
  });
  const [roomStatus, setAssign] = useState(false);

  const loginUser = async () => {
    const res = await fetch("/users/full-details", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.jwt}`,
      },
    });
    if (!(res.status === 200)) {
      console.log("Error");
      // errorNotify();
      // setInterval(() => {
      // }, 100);
      window.open(`${base}/users/signin`, "_self");
    } else {
      const data = await res.json();
      const { assigned } = data;
      // console.log("Assigned-:", assigned);
      const result = data.data;
      // console.log(result.room.type);
      setType(result.room.type);
      if (!assigned) {
        setAssign(false);
        // console.log("Back res-:",result);
        setUser({
          id: result._id,
          name: result.name,
          reg_no: result.reg_no,
          wardenName: result.room.warden.name,
          wardenNumber: result.room.warden.contact,
          v: result.__v,
          roomNumber: result.room.number,
          segment: result.room.segment,
        });
      } else {
        setAssign(true);
        const mate = data.roomMate;
        // console.log("Mate assigned hai!!", result, mate);
        setUser({
          id: result._id,
          name: result.name,
          reg_no: result.reg_no,
          wardenName: result.room.warden.name,
          wardenNumber: result.room.warden.contact,
          v: result.__v,
          roomNumber: result.room.number,
          segment: result.room.segment,
        });
        setMate({
          id: mate._id,
          roomMateName: mate.name,
          roomMateReg_no: mate.reg_no,
        });
      }
    }
  };

  useEffect(() => {
    if (cookie.user && cookie.jwt) loginUser();
    else {
      navigate("/users/signin");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Component
        user={user}
        mate={roomMate}
        assigned={roomStatus}
        type={type}
      />
    </>
  );
};

export default AuthUser;
