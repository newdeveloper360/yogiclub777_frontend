import React from "react";
import Logo from "../assets/imgs/Logo.png";
import Safe from "../assets/imgs/Safe.png";

const Splash = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-primary">
      <img src={Logo} alt="Logo" className="h-40" />
      {/* <img src={Safe} alt="Safe" className="h-40" /> */}
      {/* <p className="mt-3 text-xs font-semibold">आपका भरोसा ही 100% हमारी पहचान है</p> */}
    </div>
  );
};

export default Splash;
