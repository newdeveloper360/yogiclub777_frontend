import React from "react";

const AmountSelector = ({ placeholder, minAmount, onChange, value, tabParam }) => {
  let priceList = tabParam === "withdrawPoints" ? [minAmount, 1000, 1500, 2000, 2500, 3000] : [minAmount, 200, 500, 1000, 1500, 2500];
  return (
    <div className="p-3">
      <div className="relative w-full">
        <input
          type="number"
          className="w-full p-2 px-4 pl-10 text-sm border border-black/30 rounded-3xl"
          placeholder={placeholder}
          value={value}
          required
          min={minAmount}
          onChange={(e) => onChange(e.target.value)}
        ></input>
        <div className="absolute flex items-center justify-center w-8 h-8 text-white -translate-y-1/2 rounded-full top-1/2 left-1 bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
            />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {priceList.map((price) => (
          <button
            type="button"
            onClick={() => onChange(price)}
            className="flex items-center justify-center p-2 text-sm font-semibold bg-white border rounded-md shadow-md border-black/200"
          >
            {price}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AmountSelector;
