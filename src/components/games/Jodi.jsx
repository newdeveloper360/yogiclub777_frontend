import React, { useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";

const JodiBox = ({ idx, minAmount, maxAmount, value, onChange }) => {
  return (
    <div className="flex flex-col text-center border border-primary">
      <div className="text-sm text-white bg-primary">
        {idx.toString().padStart(2, 0)}
      </div>
      <input
        value={value}
        min={minAmount}
        max={maxAmount}
        onChange={onChange}
        type="number"
        className="w-full text-center outline-none"
      />
    </div>
  );
};

const Jodi = ({ maxAmount, onPointChanged, handleSubmit, isFormLoading }) => {
  let { appData } = useSelector((state) => state.appData.appData);
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-4 gap-2 p-2">
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
