import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// const ErrorNotify = () => toast.error("Login as admin to continue!!");

const Protected = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const [cookie] = useCookies();
  const [nl,setNl]=useState(0);
  const adminLogin = async (data) => {
    const res = await fetch("/admin/verify-admin", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.admin}`,
      },
    });
    if (!(res.status === 200)) {
      console.log("Admin verification failed");
      // ErrorNotify();
      navigate("/admin/signin");
    } else {
      // console.log("Admin verified sucessfully");
      const resp=await res.json();
      const {data}=resp;
      setNl(data);
    }
  };
  useEffect(() => {
    if (cookie.admin) adminLogin();
    else {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Component nl={nl} />
    </>
  );
};

export default Protected;