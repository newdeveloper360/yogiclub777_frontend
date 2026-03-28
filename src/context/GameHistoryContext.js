import React, { createContext, useEffect, useState } from "react";
import { getGameHistory } from "../repository/HistoryRepository";
import { toast } from "react-toastify";

export const GameHistoryContext = createContext();

export function GameHistoryProvider({ children }) {
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState("");
  const [marketId, setMarketId] = useState("");
  const [dataLoading, setDataLoading] = useState(false);

  const fetchCurrentHistory = async () => {
    try {
      setDataLoading(true);
      let { data } = await getGameHistory({ page: currentPage, date, marketId });

      if (data.error === false) {
        setHistoryData(data.response.gameHistory.data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      fetchCurrentHistory();
    }
  }, [currentPage, date, marketId]); // Runs when dependencies change

  return (
    <GameHistoryContext.Provider value={{ historyData, setCurrentPage, setDate, setMarketId, dataLoading }}>
      {children}
    </GameHistoryContext.Provider>
  );
}
