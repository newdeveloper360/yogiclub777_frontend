import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const MarketResult = () => {
  let { appData } = useSelector((state) => state.appData.appData);
  const { market_id } = useParams();

  useEffect(() => {
    document.title = "Market Result | Yogi Club777";
  }, []);

  return (
    <div className="w-full h-[100dvh] overflow-hidden">
      <iframe
        className="w-full h-full border-0"
        src={`${appData.base_domain}/desawar/chart/${market_id}`}
        title="Market Result"
        allowFullScreen
      />
    </div>
  );
};

export default MarketResult;