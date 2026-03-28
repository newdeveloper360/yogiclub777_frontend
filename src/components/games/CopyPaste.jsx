import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../Spinner";
import { toast } from "react-toastify";

const CopyPaste = ({ maxAmount, onPointDelete, resetGames, updateCompleteGame, handleSubmit, isFormLoading, isSuccessfullySubmitted }) => {
  let { appData } = useSelector(state => state.appData.appData);
  let [number, setNumber] = useState("");
  let [point, setPoint] = useState("");
  let [isPlati, setIsPlati] = useState(true);
  let [tableItems, setTableItems] = useState([]);

  const splitIntoPairs = (str) => {
    let result = [];
    for (let i = 0; i < str.length; i += 2) {
      result.push(parseInt(str.substr(i, 2)));
    }
    return result;
  }

  function reverseString(str) {
    return str.toString().split('').reverse().join('');
  }

  const generateNumbers = () => {
    let arrayList = splitIntoPairs(number)
    if (isPlati) {
      let newArr = [];
      for (let item of arrayList) {
        newArr.push(item.toString().padStart(2, "0"));
        newArr.push(reverseString(item.toString().padStart(2, "0")));
      }
      arrayList = newArr;
    }
    let result = []
    for (let item of Array.from(new Set(arrayList))) {
      result.push({
        number: item.toString().padStart(2, "0"),
        amount: point,
        session: "null",
        game_type_id: 16,
      },)
      setTableItems((prevState) => [
        ...prevState,
        {
          number: item.toString().padStart(2, "0"),
          amount: point,
          session: "null",
          game_type_id: 16,
        },
      ]);
    }
    return result
  };

  useEffect(() => {
    if (isSuccessfullySubmitted) {
      setNumber("");
      setPoint("");
      setTableItems([])
    }
  }, [isSuccessfullySubmitted])

  return (
    <div className="pb-8">
      <form onSubmit={(e) => {
        e.preventDefault();
        if (number.length % 2 !== 0) {
          toast.error("Length of number must be even");
          return;
        }
        resetGames();
        setTableItems([]);
        let result = generateNumbers();
        updateCompleteGame(result);
      }} className="p-3 text-xs">
        <div className="flex flex-col">
          <label className="text-xs font-semibold">Number</label>
          <input
            type="number"
            className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
            placeholder=""
            required
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          ></input>
        </div>
        <div className="flex flex-col mt-2">
          <label className="text-xs font-semibold">Points</label>
          <input
            type="number"
            className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
            placeholder=""
            required
            value={point}
            onChange={(e) => {
              setPoint(e.target.value);
            }}
            max={maxAmount}
            min={appData?.min_bid_amount}
          ></input>
          <div className="flex mt-1">
            <label className="flex items-center">
              <input type="radio" checked={isPlati} name="plati" onChange={(e) => setIsPlati(true)} value="withPlati" />
              <span className="ml-0.5">With Plati</span>
            </label>
            <label className="flex items-center ml-2">
              <input type="radio" checked={!isPlati} name="plati" onChange={(e) => setIsPlati(false)} value="withoutPlati" />
              <span className="ml-0.5">Without Plati</span>
            </label>
          </div>
        </div>
        <button className="flex justify-center w-full p-1 mt-2 text-sm text-white rounded bg-orange">
          Add
        </button>
        <table className="mt-2 text-xs table-fixed">
          <thead>
            <tr>
              <th>Number type</th>
              <th>Number</th>
              <th>Points</th>
              <th>Action</th>
            </tr>
          </thead>
          {tableItems.map((tableItem) => (
            <tr className="text-center">
              <td>Jodi</td>
              <td>{tableItem.number.toString().padStart(2, "0")}</td>
              <td>{tableItem.amount}</td>
              <td>
                <button type="button" onClick={() => {
                  onPointDelete(tableItem);
                  setTableItems(prevState => {
                    let arr = prevState.filter(ps => ps.number != tableItem.number);
                    return [...arr];
                  })
                }} className="py-0.5 px-1.5 bg-red-500 text-white rounded-md text-[9px]">Delete</button>
              </td>
            </tr>
          ))}
        </table>
      </form>
      <div className="fixed w-full p-2 max-w-[480px] bottom-0 flex flex-col items-center justify-center left-1/2 -translate-x-1/2 h-14">
        <div className="flex w-full mb-1 font-semibold">
          <small>Total Points</small>
          <small className="ml-auto">{tableItems.reduce((prev, curr) => {
            return prev + Number(curr.amount)
          }, 0)}</small>
        </div>
        <button disabled={isFormLoading} onClick={handleSubmit} className="w-full py-1 text-sm font-semibold text-white rounded-3xl bg-orange">
          {isFormLoading ? <Spinner /> : "Place bet"}
        </button>
      </div>
    </div>
  );
};

export default CopyPaste;
