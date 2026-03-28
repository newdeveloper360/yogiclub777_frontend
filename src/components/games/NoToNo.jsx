import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../Spinner";

const NoToNo = ({ maxAmount, onPointDelete, resetGames, updateCompleteGame, handleSubmit, isFormLoading, isSuccessfullySubmitted }) => {
    let { appData } = useSelector((state) => state.appData.appData);
    let [firstNumber, setFirstNumber] = useState("");
    let [secondNumber, setSecondNumber] = useState("");
    let [point, setPoint] = useState("");
    let [tableItems, setTableItems] = useState([]);
    let [error, setError] = useState("");

    // Function to validate and format input to 2 digits only
    const handleNumberInput = (value, setter) => {
      // Remove non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      
      // Only allow up to 2 digits
      if (numericValue.length <= 2) {
        setter(numericValue);
      }
    };

    // Format number to 2 digits (e.g., 2 -> 02)
    const formatToTwoDigits = (num) => {
      return num.toString().padStart(2, '0');
    };

    const generateNumbers = () => {
      setError("");
      
      // Parse numbers
      const start = parseInt(firstNumber, 10);
      const end = parseInt(secondNumber, 10);

      // Validate inputs
      if (isNaN(start) || isNaN(end)) {
        setError("Please enter valid numbers");
        return [];
      }

      if (start < 0 || start > 99 || end < 0 || end > 99) {
        setError("Numbers must be between 00 and 99");
        return [];
      }

      if (start > end) {
        setError("First number should be less than or equal to second number");
        return [];
      }

      let result = [];
      let newTableItems = [];

      // Generate all numbers from start to end
      for (let i = start; i <= end; i++) {
        const formattedNumber = formatToTwoDigits(i);
        const item = {
          number: formattedNumber,
          amount: point,
          session: "null",
          game_type_id: 16,
        };
        result.push(item);
        newTableItems.push(item);
      }

      setTableItems(newTableItems);
      return result;
    };
  
    useEffect(() => {
      if (isSuccessfullySubmitted) {
        setFirstNumber("");
        setSecondNumber("");
        setTableItems([]);
        setPoint("");
        setError("");
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
          if (result.length > 0) {
            updateCompleteGame(result);
          }
        }}
        className="p-3"
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <label className="text-xs font-semibold">First Number</label>
            <input
              type="text"
              value={firstNumber}
              maxLength={2}
              onChange={(e) => handleNumberInput(e.target.value, setFirstNumber)}
              required
              className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary text-center text-xs font-semibold"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold">Second Number</label>
            <input
              type="text"
              value={secondNumber}
              maxLength={2}
              onChange={(e) => handleNumberInput(e.target.value, setSecondNumber)}
              required
              className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary text-center text-xs font-semibold"
            />
          </div>
        </div>
        
        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
            {error}
          </div>
        )}

        <div className="flex flex-col mt-2">
          <label className="text-xs font-semibold">Points (Amount)</label>
          <input
            type="number"
            className="p-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
            placeholder="Enter amount"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            max={maxAmount}
            required
            min={appData?.min_bid_amount}
          />
        </div>
        <button
          type="submit"
          className="flex justify-center w-full p-1 mt-3 text-sm text-white rounded bg-orange font-semibold"
        >
          Add
        </button>
      </form>

      {tableItems.length > 0 && (
        <div className="px-3">
          <div className="bg-gray-100 p-2 rounded mb-2">
            <p className="text-xs font-semibold text-gray-600">
              Generated Numbers: {firstNumber.padStart(2, '0')} to {secondNumber.padStart(2, '0')} ({tableItems.length} numbers)
            </p>
          </div>
        </div>
      )}

      <table className="mt-2 text-xs table-fixed w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Number</th>
            <th className="p-2">Points</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableItems.map((tableItem, index) => (
            <tr key={index} className="text-center border-b">
              <td className="p-2 font-semibold">{tableItem.number}</td>
              <td className="p-2">{tableItem.amount}</td>
              <td className="p-2">
                <button 
                  type="button" 
                  onClick={() => {
                    onPointDelete(tableItem);
                    setTableItems(prevState => {
                      let arr = prevState.filter(ps => ps.number !== tableItem.number);
                      return [...arr];
                    })
                  }} 
                  className="py-0.5 px-1.5 bg-red-500 text-white rounded-md text-[9px]"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fixed w-full p-2 max-w-[480px] bottom-0 flex flex-col items-center justify-center left-1/2 -translate-x-1/2 h-14 bg-white shadow-lg">
        <div className="flex w-full mb-1 font-semibold">
          <small>Total Points</small>
          <small className="ml-auto">{tableItems.reduce((prev, curr) => {
            return prev + Number(curr.amount)
          }, 0)}</small>
        </div>
        <button 
          disabled={isFormLoading || tableItems.length === 0} 
          onClick={handleSubmit} 
          className={`w-full py-1 text-sm font-semibold text-white rounded-3xl ${tableItems.length === 0 ? 'bg-gray-400' : 'bg-orange'}`}
        >
          {isFormLoading ? <Spinner /> : "Place bet"}
        </button>
      </div>
    </div>
  )
}

export default NoToNo;

