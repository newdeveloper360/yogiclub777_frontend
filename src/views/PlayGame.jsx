import React, { useEffect, useState, useContext } from "react";
import Jodi from "../components/games/Jodi";
import Manual from "../components/games/Manual";
import Harraf from "../components/games/Harraf";
import Crossing from "../components/games/Crossing";
import CopyPaste from "../components/games/CopyPaste";
import { getGameDetails, submitGame } from "../repository/GameRepository";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setAuthDataUsersSingleValue } from "../store/features/appData/appDataSlice";
import { ModalContext } from '../context/ModalContext'
import Swal from "sweetalert2";
import NoToNo from "../components/games/NoToNo";

const PlayGame = () => {
  let [activeTab, setActiveTab] = useState("jodi");
  let gameTypes = ["Jodi", "Harraf", "Crossing", "Copy Paste", "No To No"];
  let [loading, setLoading] = useState(true);
  let [market, setMarket] = useState(null);
  let [searchParams] = useSearchParams();
  let { user } = useSelector((state) => state.appData.appData);
  let [games, setGames] = useState([]);
  let [range, setRange] = useState(null);
  let [submissionLoading, setSubmissionLoading] = useState(false);
  let [isSuccessfullySubmitted, setSuccessfullySubmitted] = useState(false);

  const dispatch = useDispatch();

  let Component = {
    jodi: Jodi,
    manual: Manual,
    harraf: Harraf,
    crossing: Crossing,
    "copy paste": CopyPaste,
    "no to no": NoToNo,
  };

  useEffect(() => {
    let timerId = "";
    const startGameCloseTimer = (closeTime) => {
      const endTime = moment(closeTime, 'YYYY-MM-DD hh:mm A'); // Specify format
      const updateTimer = () => {
        const now = moment();
        const duration = moment.duration(endTime.diff(now));
        let time = "";
        if (duration.asSeconds() <= 0) {
          time = "" // Time's up! | Inactive
          clearInterval(timerId);
          return;
        }

        const hours = Math.floor(duration.asHours());
        const minutes = Math.floor(duration.minutes());
        const seconds = Math.floor(duration.seconds());

        time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} | Active`;
        let gameTimer = document.getElementById("gameTimer");
        if (gameTimer)
          gameTimer.innerText = time;
        else
          clearInterval(timerId)
      };

      updateTimer(); // Initial call to set the correct time immediately
      timerId = setInterval(updateTimer, 1000);
      return () => clearInterval(timerId);
    };
    if (market) {
      startGameCloseTimer(market.formatted_close_time);
    }
  }, [market]);

  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        let { data } = await getGameDetails({
          marketId: searchParams.get("market_id"),
        });
        if (data.error) {
          toast.error(data.message);
        } else {
          let market = data?.response?.market;
          setMarket(market);
          let gameName = document.getElementById("gameName");
          let gameEndTimer = document.getElementById("gameEndTimer");
          if (gameEndTimer)
            gameEndTimer.innerHTML = `
            <small>गेम का लास्ट टाइम</small>
            <small id="gameTimer">
            </small>
          `
          if (gameName)
            gameName.innerText = market.name

        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, []);

  const handlePointDelete = (payload) => {
    setGames(prevState => {
      let newArr = prevState.filter(ps => ps.number != payload.number);
      return [...newArr];
    })
  }

  const resetGames = () => {
    setGames([]);
  }

  const handleCompleteUpdate = (updatedGames) => {
    setGames(updatedGames)
  }

  const getCurrentActiveTimeRange = () => {
    const currentTime = moment();

    // Define the time ranges with their corresponding max bet amounts
    const timeRanges = [
      { start: market.formatted_c_time_start, end: market.formatted_c_time_end, maxBetAmount: market.c_max_bet_amount },
      { start: market.formatted_c2_time_start, end: market.formatted_c2_time_end, maxBetAmount: market.c2_max_bet_amount },
      { start: market.formatted_c3_time_start, end: market.formatted_c3_time_end, maxBetAmount: market.c3_max_bet_amount },
    ];

    for (const range of timeRanges) {
      const start = moment(range.start, 'YYYY-MM-DD hh:mm A');
      const end = moment(range.end, 'YYYY-MM-DD hh:mm A');

      if (currentTime.isBetween(start, end)) {
        return range;
      }
    }
  }

  const getMaxBetAmount = (market) => {
    let range = getCurrentActiveTimeRange(market);
    if (range)
      return range.maxBetAmount
    return market.max_bet_amount;
  };
  let { toggleSuccessModalOpen, setSuccessMessage } = useContext(ModalContext)

  let NewComponent = Component[activeTab];
  const handlePointChanged = (payload) => {
    setGames((prevState) => {
      let gameIdx = prevState.findIndex((ps) => ps.number === payload.number && ps.game_type_id === payload.gameTypeId);
      if (gameIdx === -1) {
        prevState.push({
          number: payload.number,
          amount: payload.amount,
          session: "null",
          game_type_id: payload.gameTypeId,
        });
      } else {
        prevState[gameIdx].amount = payload.amount;
      }
      return [...prevState];
    });
  };

  useEffect(() => {
    if (market) {
      let range = getCurrentActiveTimeRange(market);
      setRange(range)
    }
  }, [market])

  useEffect(() => {
    if (!market || !market.formatted_bet_time_limit) {
      return;
    }
    
    let timerId = "";
    const startGameCloseTimer = (closeTime) => {
      const endTime = moment(closeTime, 'YYYY-MM-DD hh:mm A'); // Specify format
      const updateTimer = () => {
        const now = moment();
        const duration = moment.duration(endTime.diff(now));
        let time = "";
        if (duration.asSeconds() <= 0) {
          time = ""; // Time's up! | Inactive
          let gameTimer = document.getElementById("insideTime");
          if (gameTimer)
            gameTimer.innerText = time;
          clearInterval(timerId);
          return;
        }

        const hours = Math.floor(duration.asHours());
        const minutes = Math.floor(duration.minutes());
        const seconds = Math.floor(duration.seconds());

        time = `मोटी जोड़ी का लास्ट टाइम : ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        let gameTimer = document.getElementById("insideTime");
        if (gameTimer)
          gameTimer.innerText = time;
        else
          clearInterval(timerId)
      };

      updateTimer(); // Initial call to set the correct time immediately
      timerId = setInterval(updateTimer, 1000);
    };

    startGameCloseTimer(market.formatted_bet_time_limit);
    
    return () => clearInterval(timerId);
  }, [market])

  return (
    <div className="pb-8">
      <div className="grid grid-cols-5 bg-white shadow-md">
        {gameTypes.map((gameType) => (
          <button
            onClick={() => {
              setActiveTab(gameType.toLowerCase());
              setGames([]);
            }}
            className={`py-2 text-xs text-center relative bg-primary text-white m-1 ${gameType.toLowerCase() === activeTab
              ? "font-black after:block after:absolute after:left-0 after:top-full after:w-full after:h-0.5 after:bg-black"
              : ""
              }`}
          >
            {gameType}
          </button>
        ))}
      </div>
      {market && market.formatted_bet_time_limit &&
        <div id="insideTime" className="p-1 text-xs font-semibold text-center bg-yellow-500 text-orange">

        </div>
      }
      {loading ? (
        <div className="mt-4 grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
          <svg
            className="text-gray-300 animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-gray-600"
            ></path>
          </svg>
        </div>
      ) : market === null ? (
        <div className="flex justify-center mt-4 text-sm">Market not found</div>
        )
          : market.game_on === false ? (
            <div className="flex justify-center mt-4 text-sm">Game off</div>
          )
          : (
            <>

              <div className="flex px-2 text-sm">
                <div className="flex flex-col items-center font-semibold">
                  <small className="text-primary">Points Remaining</small>
                  <small>
                    {Number(user.balance) -
                      games.reduce((prev, curr) => prev + Number(curr.amount), 0)}
                  </small>
                </div>
                <div className="flex flex-col items-center ml-auto font-semibold">
                  <small className="text-primary">Points Added</small>
                  <small>
                    {games.reduce((prev, curr) => prev + Number(curr.amount), 0)}
                  </small>
                </div>
              </div>
              <NewComponent
                  isSuccessfullySubmitted={isSuccessfullySubmitted}
                onPointDelete={handlePointDelete}
                onPointChanged={handlePointChanged}
                updateCompleteGame={handleCompleteUpdate}
                  maxAmount={getMaxBetAmount(market)}
                resetGames={resetGames}
                  isFormLoading={submissionLoading}
                handleSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    setSubmissionLoading(true);
                    if (games.every(game => game.amount === "")) {
                      toast.error("Game fields are required.");
                    } else {
                      let { data } = await submitGame({
                        type: "desawar",
                        market_id: searchParams.get("market_id"),
                        games: games.filter((game) => game.amount !== ""),
                      });
                      if (data.error) {
                        toast.error(data.message);
                      } else {

                        if (!data.response.bid_pdf_download) {
                          Swal.fire({
                            // title: "Bet",
                            text: "Game ok Successfully.",
                            icon: "success"
                          });
                        }
                        
                        if (data.response.bid_pdf_download) {
                          Swal.fire({
                            title: "क्या आप सुनिश्चित हैं?",
                            text: "क्या आप रसीद डाउनलोड करना चाहते हैं?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "हाँ, डाउनलोड करें!"
                          }).then((result) => {
                            if (result.isConfirmed) {
                              // Swal.fire({
                              //   title: "Downloading...",
                              //   text: "Your receipt is being downloaded.",
                              //   icon: "success"
                              // });
                              
                              // download bid
                              if (data.response.bid_pdf_download) {
                                const pdfUrl = data.response.pdf_url;
                                const link = document.createElement('a');
                                link.href = pdfUrl;
                                link.download = 'Your_Bid.pdf';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }
                          });
                        }

                        
                        // toggleSuccessModalOpen();
                        // setSuccessMessage(data.message)
                        if (e && e.target && e.target.reset) {
                          e?.target?.reset();
                        }
                        dispatch(
                          setAuthDataUsersSingleValue({
                            key: "balance",
                            value: data.response.balance_left,
                          })
                        );
                        setGames([])
                        setSuccessfullySubmitted(true);
                        window.setTimeout(() => {
                          setSuccessfullySubmitted(false);
                        }, 500);                      
                      }
                    }
                  } catch (err) {
                    toast.error(err.message);
                  } finally {
                    setSubmissionLoading(false);
                  }
                }}
              />
            </>
          )}
    </div>
  );
};

export default PlayGame;
