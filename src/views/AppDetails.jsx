import React, { useEffect } from "react";
import Logo from "../assets/imgs/Logo.png";
import { useSelector } from "react-redux";

const AppDetails = () => {
  let {appData} = useSelector(state => state.appData.appData);

  useEffect(()=>{
    document.title = "App Details | Yogi Club777"
  }, [])

  return (
    <div className="p-3">
      <img src={Logo} alt="Logo" className="w-[150px] h-[150px] mx-auto"/>
      <div className="p-3 mt-1 font-semibold text-center bg-white border rounded-md shadow-md border-black/15 text-md">
        TM Application: {appData?.tm_no}
      </div>
      <div className="p-3 mt-4 font-semibold text-center bg-white border rounded-md shadow-md border-black/15 text-md">
        ARN Number: {appData?.arn_no}
      </div>
      <div className="p-3 mt-4 font-semibold text-center bg-white border rounded-md shadow-md border-black/15 text-md">
        Provisional ID: {appData?.provisoinal_id}
      </div>
    </div>
  );
};

export default AppDetails;
