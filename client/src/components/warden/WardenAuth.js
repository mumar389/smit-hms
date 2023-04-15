import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//Outlet
// const ErrorNotify = () => toast.error("Login as admin to continue!!");

const WardenAuth = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const [cookie] = useCookies();
  const [warden,setWarden]=useState({});

  const wardenLogin = async (e) => {
    const res = await fetch("/wardens/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.warden}`,
      },
    });
    if (!(res.status === 200)) {
      console.log("Warden verification failed");
      //   ErrorNotify();
      navigate("/warden/signin");
    } else {
      // console.log("Admin verified sucessfully");
      const response=await res.json();
      const {data}=response;
      setWarden(data);
    }
  };
  useEffect(() => {
  if(cookie.warden)
    wardenLogin();
    else{
      navigate('/')
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Component warden={warden}/>
    </>
  );
};

export default WardenAuth;
