import moment from "moment";
import React, { useEffect, useState } from "react";

const Time = () => {
  let [time, setTime] = useState(moment.now());
  useEffect(()=>{
    window.setInterval(()=>{
        setTime(moment.now())
    }, 1000)
  }, [])
  return <>{moment(time).format("HH:mm:ss")}</>;
};

export default Time;
