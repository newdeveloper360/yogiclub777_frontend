import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import IcChartOne from "../assets/imgs/ic_chart.png";
import IcChartTwo from "../assets/imgs/ic_chart_green.png";
import PlayImg from "../assets/imgs/white_play.webp";

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const Play = () => {
  // const { markets } = useSelector(state => state?.markets?.markets);
  const marketsData = useSelector(state => state?.markets?.markets) ?? [];
  const markets = marketsData?.markets ?? []; 

  // const [liveNumbers, setLiveNumbers] = useState(
  //   markets?.map(() => getRandomNumber(1700, 2500))
  // );
  // const [bidsNumbers, setBidsNumbers] = useState(
  //   markets?.map(() => getRandomNumber(17000, 25000))
  // );

  const [liveNumbers, setLiveNumbers] = useState(
    markets?.length ? markets.map(() => getRandomNumber(1700, 2500)) : []
  );

  const [bidsNumbers, setBidsNumbers] = useState(
    markets?.length ? markets.map(() => getRandomNumber(17000, 25000)) : []
  );

  useEffect(() => {
    if (markets.length > 0) {
      setLiveNumbers(markets.map(() => getRandomNumber(1700, 2500)));
      setBidsNumbers(markets.map(() => getRandomNumber(17000, 25000)));
    }
  }, [markets]);
  
  
  const [direction, setDirection] = useState("up");
  const [updateCount, setUpdateCount] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true); // New state to control visibility

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= 3) {
          // Change direction every 3 updates
          setDirection(prevDirection => (prevDirection === "up" ? "down" : "up"));
          return 0;
        }
        return newCount;
      });

      setLiveNumbers(prevLiveNumbers =>
        prevLiveNumbers.map(num => 
          direction === "up"
            ? num + getRandomNumber(10, 50) - getRandomNumber(0, 10)
            : num - getRandomNumber(0, 10) // Ensure decrement is within 0-10 range
        )
      );

      setBidsNumbers(prevBidsNumbers =>
        prevBidsNumbers.map(num => 
          direction === "up"
            ? num + getRandomNumber(50, 250) - getRandomNumber(0, 50)
            : num - getRandomNumber(0, 50) // Ensure decrement is within 0-10 range
        )
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div className="py-3 pb-1">
      <div className="flex flex-col gap-1">
        {markets?.map((market, index) => (
          <div key={market?.name} className="px-3 py-2 text-white bg-primary">
            {showNumbers && market?.game_on && ( 
              <div className="w-full flex justify-center gap-2 mb-0">
                <div className="px-2 rounded-md flex justify-center items-center text-[12px] bg-yellow-color">
                  <GoDotFill size={18} color="#fff" />LIVE: {liveNumbers[index]}
                </div>
                <div className="px-2 rounded-md flex justify-center items-center text-[12px] text-[#fff]">
                  <GoDotFill size={18} className="text-yellow-color" />Bids: {bidsNumbers[index]}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold uppercase">
                <Link to={`/market-result/${market?.id}`}>                
                  { index % 2 !== 0 ? (
                    <img className="h-12" alt="IcChartTwo" src={IcChartTwo} />
                  ) : (
                    <img className="h-12" alt="IcChartOne" src={IcChartOne} />
                  )}
                </Link>
              </span>

              <div className="text-center">
                <span className="text-[14px] font-semibold">{market?.name}</span>
                <p className="text-[14px] font-semibold">
                  {/* {market?.last_result?.first_digit_of_result || "***"}_ */}
                  {market?.last_result?.result || "***_**_***"}
                  {/* _{market?.last_result?.second_digit_of_result || "***"} */}
                </p>

                <div className="flex gap-6 mt-2">
                  <div className="flex flex-col items-center">
                    <small className="text-[10px]">Open Time :</small>
                    <small className="text-[10px]">{market?.open_time}</small>
                  </div>
                  <div className="flex flex-col items-center">
                    <small className="text-[10px]">Close Time :</small>
                    <small className="text-[10px]">{market?.close_time}</small>
                  </div>
                </div>
                
              </div>
              
              <Link className={`px-2 py-0.5 text-xs`} to={!market?.game_on ? "#" : `/play-game?gameType=${market.name}&market_id=${market?.id}`}>
                <div className="flex flex-col items-center justify-center text-center">
                  {!market?.game_on ? (
                    <small style={{color: "#E7000B"}}>Time Out</small>
                  ) : (
                    <small style={{color: "#00C951"}}>Running now</small>
                  )}
                  {/* <img className="h-12 my-1" alt="PlayImg" src={PlayImg} /> */}
                  <svg width="55" height="55" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="#FCB52E" />
                    <polygon points="40,30 70,50 40,70" fill="#0B457C" />
                  </svg>
                  <small style={{color: "#fff"}}>Play Game</small>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Play;
