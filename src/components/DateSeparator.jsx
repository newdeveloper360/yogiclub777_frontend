import React from "react";

const DateSeparator = ({ date }) => {
  return (
    <div className="flex items-center py-2 text-orange">
      <div className="w-full h-0.5 bg-orange"></div>
      <span className="mx-3">{date}</span>
      <div className="w-full h-0.5 bg-orange"></div>
    </div>
  );
};

export default DateSeparator;
