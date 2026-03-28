import React from "react";

const Pagination = ({ currentPage, lastPage, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="w-[200px]">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            onChange((prevState) => prevState - 1);
          }}
          className="p-2 px-4 text-xs text-white bg-black rounded-md disabled:opacity-55 disabled:cursor-not-allowed"
        >
          Previous
        </button>
      </div>
      <small className="flex items-center justify-center w-full">
        {currentPage} / {lastPage}
      </small>
      <div className="w-[200px] flex justify-end">
        <button
          disabled={lastPage === currentPage}
          onClick={() => {
            onChange((prevState) => prevState + 1);
          }}
          className="p-2 px-4 text-xs text-white bg-black rounded-md disabled:opacity-55 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
