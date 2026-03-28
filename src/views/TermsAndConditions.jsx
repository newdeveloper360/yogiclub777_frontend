import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const TermsAndConditions = () => {
  let { appData } = useSelector((state) => state.appData.appData);
  useEffect(() => {
    document.title = "Terms and Conditions | Yogi Club777"
  }, [])
  return <div className="p-3 pb-8">
    <span dangerouslySetInnerHTML={{__html:appData?.custom_message_5_terms}}></span>
  </div>;
};

export default TermsAndConditions;
