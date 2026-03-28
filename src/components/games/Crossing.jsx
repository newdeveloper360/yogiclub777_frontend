import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../Spinner";

const Crossing = ({ maxAmount, onPointDelete, resetGames, updateCompleteGame, handleSubmit, isFormLoading, isSuccessfullySubmitted }) => {
  let { appData } = useSelector((state) => state.appData.appData);
  let [crossingBox1, setCrossingBox1] = useState("");
  let [crossingBox2, setCrossingBox2] = useState("");
  let [isJodiCut, setIsJodiCut] = useState(false);
  let [point, setPoint] = useState("");
  let [tableItems, setTableItems] = useState([]);
  const generateNumbers = () => {
    let crossingBox1splittedText = crossingBox1.split("");
    let crossingBox2splittedText = crossingBox2.split("");
    let arrayList = [];
    crossingBox1splittedText.forEach((text1) => {
      crossingBox2splittedText.forEach((text2) => {
        arrayList.push(`${text1}${text2}`);
      });
    });
    let result = [];
    for (let item of Array.from(new Set(arrayList))) {
      if (isJodiCut) {
        let firstDigit = item.charAt(0);
        let secondDigit = item.charAt(1);
        if (firstDigit === secondDigit) {
          continue;
        }
      }
      
      result.push({
        number: item,
        amount: point,
        session: "null",
        game_type_id: 16,
      },)
      setTableItems((prevState) => [
        ...prevState,
        {
          number: item,
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
      setCrossingBox1("");
      setCrossingBox2("");
      setTableItems([]);
      setPoint("");
    }
  }, [isSuccessfullySubmitted])

  return (
    <div className="pb-8 text-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          resetGames();
          setTableItems([]);
          let result = generateNumbers();
          updateCompleteGame(result);
        }}
        className="p-3"
      >
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex flex-col">
            <label className="text-xs font-semibold">Crossing</label>
            <input
              type="text"
              value={crossingBox1}
              maxLength={7}
              onChange={(e) => setCrossingBox1(e.target.value)}
              onBlur={() => {
                setCrossingBox2(crossingBox1);
              }}
              required
              className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
              placeholder=""
            ></input>
          </div>
          <div className="flex flex-col hidden">
            <label className="text-xs font-semibold">Crossing</label>
            <input
              type="text"
              value={crossingBox2}
              onChange={(e) => setCrossingBox2(e.target.value)}
              className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
              placeholder=""
              required
            ></input>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <label className="text-xs font-semibold">Points</label>
          <input
            type="number"
            className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
            placeholder=""
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            max={maxAmount}
            required
            min={appData?.min_bid_amount}
          ></input>
        </div>

        <div className="flex justify-end my-3">
          <label className="flex items-center ml-2">
            <input type="checkbox" checked={isJodiCut} name="jodiCut" onChange={(e) => setIsJodiCut(isJodiCut ? false : true)} value="jodiCut" />
            <span className="ml-0.5">Jodi Cut</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="flex justify-center w-full p-1 mt-2 text-sm text-white rounded bg-orange"
        >
          Add
        </button>
      </form>
        <table className="mt-2 text-xs table-fixed">
          <thead>
            <tr>
              <th>Number type</th>
              <th>Number</th>
              <th>Points</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableItems.map((tableItem) => (
              <tr className="text-center">
                <td>Crossing</td>
                <td>{tableItem.number}</td>
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
          </tbody>
      </table>
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

export default Crossing;
