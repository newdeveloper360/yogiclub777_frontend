import React, { useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";

const JodiBox = ({ idx, minAmount, maxAmount, value, onChange }) => {
  return (
    <div className="flex flex-col text-center border border-gray-400" style={{ fontSize: '0.6rem', padding: '3px' }}>
      <div className="text-xs text-black bg-transparent">
        {idx.toString().padStart(2, '0')}
      </div>
      <input
        value={value}
        min={minAmount}
        max={maxAmount}
        onChange={onChange}
        type="number"
        className="w-full text-center outline-none"
        style={{ height: '20px', padding: '2px', border: '1px solid gray' }}
      />
    </div>
  );
};

const Jodi = ({ maxAmount, onPointChanged, handleSubmit, isFormLoading }) => {
  let { appData } = useSelector((state) => state.appData.appData);
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-10 gap-1 p-1 bg-beige">
        {new Array(100).fill("").map((_, idx) => (
          <JodiBox
            minAmount={appData.min_bid_amount}
            maxAmount={maxAmount}
            onChange={(e) => {
              let payload = {
                amount: e.target.value,
                number: idx.toString().padStart(2, "0"),
                gameTypeId: 16
              };
              onPointChanged(payload)
            }}
            idx={idx}
          />
        ))}

        <div className="fixed w-full p-2 max-w-[480px] bottom-0 flex items-center justify-center left-1/2 -translate-x-1/2 h-9">
          <button
            type="submit"
            disabled={isFormLoading}
            className="w-full py-1 text-sm font-semibold text-white rounded-3xl bg-orange"
          >
            {isFormLoading ? <Spinner /> : "Play"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Jodi;
