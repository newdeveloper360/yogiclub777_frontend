import React, { useEffect, useState } from "react";
import { getGameHistory } from "../repository/HistoryRepository";
import { toast } from "react-toastify";
import { getMarkets } from "../repository/MarketRepository";
import { deleteSinglePlay } from "../repository/GameRepository";
import { useDispatch } from "react-redux";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";

const History = () => {
  let [currentPage, setCurrentPage] = useState(1);
  let [marketId, setMarketId] = useState("");
  let [lastPage, setLastPage] = useState(1);
  let [date, setDate] = useState("");
  let [dataLoading, setDataLoading] = useState(false);
  let [perPageRecords, setPerPageRecords] = useState(10);
  let [deleteIdxArr, setDeleteIdxArr] = useState([]);
  let [deleteDialog, setDeleteDialog] = useState(false);
  let [deleteMessage, setDeleteMessage] = useState("");

  let [markets, setMarkets] = useState([]);

  const [historyData, setHistoryData] = useState([]);

  const fetchCurrentHistory = async () => {
    try {
      setDataLoading(true);
      let { data } = await getGameHistory({
        page: currentPage,
        date,
        marketId,
      });
      if (data.error === false) {
        setHistoryData(data.response.gameHistory.data);
        setLastPage(data.response.gameHistory.last_page);
        setPerPageRecords(data.response.gameHistory.per_page);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDataLoading(false);
    }
  };
  useEffect(() => {
    fetchCurrentHistory();
  }, [currentPage]);

  useEffect(() => {
    document.title = "My Play History | Yogi Club777";
  }, []);

  useEffect(() => {
    const fetchMarkets = async () => {
      let { data } = await getMarkets();
      if (data.error === false) {
        setMarkets(data.response.markets);
      } else {
        toast.error(data.message);
      }
    };
    fetchMarkets();
  }, []);

  const toggleDeleteDialog = () => {
    setDeleteDialog(prevState => !prevState);
  }

  return (
    <>
      <Modal isOpen={deleteDialog} toggle={toggleDeleteDialog}>
        <div className='font-semibold text-black bg-white'>
          <div className='flex justify-end p-3 border-b border-black'>
            <button onClick={toggleDeleteDialog}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M6 18 18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className="w-11/12 max-w-[480px] p-3">
            {deleteMessage}
          </div>
        </div>
      </Modal>
      <div className="flex p-3 text-white bg-primary">
        <form onSubmit={e => {
          e.preventDefault();
          if (currentPage === 1)
            fetchCurrentHistory()
          else
            setCurrentPage(1);
        }} className="flex items-end w-full gap-4">
          <div className="grid w-full grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold">Date</label>
              <input
                className="h-10 px-2 py-1 mt-1 text-black border-0 rounded"
                style={{border: "2px solid black"}}
                type="date"
                value={date}
                name="date"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Market</label>
              <select
                style={{border: "2px solid black"}}
                value={marketId}
                name="marketId"
                onChange={(e) => setMarketId(e.target.value)}
                className="h-10 px-2 py-1 mt-1 text-black border-0 rounded"
              >
                <option value="">Select Market</option>
                {markets?.map((market) => (
                  <option value={market?.id}>{market?.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="flex-shrink-0 text-orange">
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
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </form>
      </div>
      <div className="w-full  overflow-auto">
        <table className="w-full text-xs table-auto">
          <thead className="bg-greenLight">
            <tr>
              <th className="p-0.5">S.No</th>
              <th className="p-0.5">Date</th>
              <th className="p-0.5">Name</th>
              <th className="p-0.5">Status</th>
              <th className="p-0.5">Type</th>
              <th className="p-0.5">Number</th>
              <th className="p-0.5">Points</th>
              <th className="p-0.5">Earned</th>
              <th className="p-0.5 hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!dataLoading && historyData.map((dataItem, dataItemIdx) => (
              <tr id={`Row${dataItem.gameId}`} className="text-center">
                <td className="p-1">{dataItemIdx + 1 + (currentPage - 1) * perPageRecords}</td>
                <td className="p-1">{dataItem["created_at"]}</td>
                <td className="p-1">{dataItem["market"]["name"]}</td>
                <td className="p-1" style={{ color: dataItem["status"] === 'CANCELED' ? 'red' : '' }}>{dataItem["status"]}</td>
                <td className="p-1">{dataItem["game_type"]["name"]}</td>
                <td className="p-1">{dataItem["number"]}</td>
                <td className="p-1">{dataItem["amount"]}</td>
                <td className="p-1">{dataItem["win_amount"]}</td>
                <td className="p-1 hidden">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setDeleteIdxArr(prevState => ([...prevState, dataItem.id]));
                        let { data } = await deleteSinglePlay({ gameId: dataItem.id });
                        if (data.error) {
                          setDeleteMessage(data.message);
                          setDeleteDialog(true);
                        } else {
                          toast.success(data.message);
                          let rowId = `Row${dataItem.gameId}`;
                          document.getElementById(rowId).remove();
                        }
                      } catch (err) {
                        toast.error(err.message)
                      }
                      finally {
                        setDeleteIdxArr(prevState => ([...prevState.filter(ps => ps !== dataItem.id)]))
                      }
                    }}
                    className="px-3 py-1 text-[9px] w-16 h-7 font-semibold text-white bg-red-700 hover:bg-red-800 rounded-md"
                  >
                    {deleteIdxArr.includes(dataItem.id) ? <Spinner size={15} /> : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div >


      {dataLoading && (
        <div className="flex justify-center w-full p-4">
          <div className="grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
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
        </div>
      )}
      {
        !dataLoading && historyData.length === 0 ? (
          <div className="w-full p-2 font-semibold text-center">
            No Data Found
          </div>
        ) : ""
      }
      {!dataLoading && historyData.length > 0 && (
        <div className="pb-4">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
};

export default History;
