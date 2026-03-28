import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Auth = () => {
  let navigate = useNavigate();
  useEffect(() => {
    let token = localStorage.getItem("authToken");
    if (token !== null) navigate("/");
  });
  return (
    <div className="font-poppins overflow-hidden relative max-w-[480px] w-full mx-auto h-[100dvh]">
      <Outlet />
    </div>
  );
};

export default Auth;
