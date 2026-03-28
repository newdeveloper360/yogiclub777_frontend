import React, { useContext } from "react";
import Container from "./Container";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../App";
import { useSelector } from "react-redux";
import { GameHistoryContext } from "../context/GameHistoryContext";
import headerLogo from "../assets/imgs/img_logo.png";

const Header = ({ toggleSideBar }) => {
  const { historyData } = useContext(GameHistoryContext);
  
  let location = useLocation();
  let { appData: initialAppData, readNotifications } = useSelector(
    (state) => state.appData
  );
  let { user, appData } = initialAppData;

  const getCurrentRouteHeading = () => {
    let currentRoute = routes[0].children.find(
      (child) => child.path === location.pathname
    );
    return currentRoute.name || "Unknown Route";
  };

  const style = {
    marginTop: "-10px",
    marginLeft: "-6px",
    borderRadius: "2px",
    padding: "0px 3px",
    background: "red",
    fontSize: "8px",
    color: "#fff",
    fontWeight: "bold",
  };

  return (
    <div className="text-white bg-new-white">
      <Container>
        <div className="flex items-center">
          <div className="flex items-center">
            <button
              onClick={toggleSideBar}
              className="relative flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-new-black"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <small style={style}>
                {historyData.filter(dataItem => dataItem.status === 'CANCELED').length}
              </small>
            </button>
            <span className="ml-3 font-semibold">
              {/* {getCurrentRouteHeading()} */}
              <img src={headerLogo} alt="Header Logo" className="w-26 h-8" />
            </span>
          </div>
          <div className="flex items-center ml-auto">
            <span className="mr-2 text-s text-new-black">
              <strong>Point:</strong> {user?.balance}
            </span>  
            {/* <button
              onClick={() => {
                window.location.reload();
              }}
              className="flex items-center justify-center px-2 py-2 text-xs text-white bg-orange-300 rounded-md shadow-md shadow-inner bg-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span className="ml-1">Refresh</span>
            </button> */}
            <Link className="relative ml-2" onClick={() => {
              let notificationCounter = document.getElementById("notificationCounter");
              if (notificationCounter) {
                notificationCounter.remove();
              }
            }} to="/notifications">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                className="w-6 h-6 text-new-black"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
              {appData.notification_count - readNotifications !== 0 && (
                <div id="notificationCounter" className="absolute w-4 h-4 rounded-full -top-1.5 -right-1.5 bg-orange flex text-[7px] items-center justify-center">
                  {appData.notification_count - readNotifications}
                </div>
              )}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
