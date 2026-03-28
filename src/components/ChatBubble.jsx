import moment from "moment";
import React from "react";

const ChatBubble = ({ message, isLeft }) => {
  return (
    <div className={`${isLeft ? 'ml-2 mr-auto w-11/12' : 'ml-auto mr-2 w-11/12'}`}>
      <div className={`relative  p-4 ml-auto text-white bg-black after:border-[10px] after:top-3 ${isLeft ? 'after:left-[-20px] after:rotate-[180deg]' : 'after:right-[-20px]'} after:border-t-transparent after:border-b-transparent after:border-r-transparent after:absolute after:border-black rounded-2xl rounded-se-[3px]`}>
        <small className="flex">{message.user.name} ({moment(message.created_at).format("hh:mm A")})</small>
        <div className="mt-3">
          {message.message}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
