import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Time from "../components/Time";

const Game = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let params = new URLSearchParams(location.search);
  let gameType = params.get("gameType");
  useEffect(() => {
    let token = localStorage.getItem("authToken");
    if (token == null) navigate("/auth/login");
  });
  return (
    <div className="font-poppins bg-primary/5 overflow-hidden relative max-w-[480px] w-full mx-auto h-[100dvh]">
      <div className="h-[56px] bg-primary flex items-center text-white p-3">
        <div className="flex items-center">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <span className="mx-auto ml-2 font-bold" id="gameName"></span>
        </div>
        <div id="gameEndTimer" className="flex flex-col items-center ml-auto text-xs">
        </div>
      </div>
      <div className="h-[calc(100dvh-56px)] overflow-auto main-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default Game;
