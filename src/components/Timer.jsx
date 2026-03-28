import moment from "moment";
import React, { useEffect } from "react";

const Timer = () => {
  useEffect(() => {
    let timer = setInterval(() => {
      let timer = document.getElementById("timer");
      if (timer)
        timer.innerText = moment().format("DD-MM-YYYY (ddd) hh:mm:ss A");
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <p id="timer"></p>;
};

export default Timer;
