import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { useSelector } from "react-redux";

const Help = () => {
  let [isOpen, setOpen] = useState(false);
  let { appData } = useSelector((state) => state.appData.appData);

  const toggle = () => {
    setOpen((prevState) => !prevState);
  };
  return (
    <div className="relative p-3 pb-8 text-sm">
      <span
        dangerouslySetInnerHTML={{
          __html: appData?.custom_message_3_help_page_1,
        }}
      ></span>
      <div className="py-2 border border-l-0 border-r-0 border-black/40">
        <span
          dangerouslySetInnerHTML={{
            __html: appData?.custom_message_4_help_page_2nd,
          }}
        ></span>
      </div>
      <div className="grid grid-cols-3 py-2 text-sm">
        <Link to="/deposit-chat" className="flex flex-col items-center">
          Deposit
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-14 h-14"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </Link>
        <Link to="/withdrawal-chat" className="flex flex-col items-center">
          Withdraw
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-14 h-14"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </Link>
        <a href="#" className="flex flex-col items-center">
          Game Play
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-14 h-14"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </a>
      </div>
      <button
        onClick={toggle}
        className="fixed z-20 flex items-center justify-center text-white bg-red-400 rounded-full bottom-10 right-3 w-14 h-14"
      >
        Chat
      </button>
      <Modal isOpen={isOpen} toggle={toggle}>
        <div className="font-semibold text-white bg-primary">
          <div className="flex justify-end p-3 border-b border-white">
            <button onClick={toggle}>
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-3 text-center">
            <div>
              <Link
                to="/withdrawal-chat"
                className="block w-full py-2 rounded-md bg-orange"
              >
                Withdrawal Chat
              </Link>
              <p className="mt-2">
                पैसे निकालने मैं अगर कोई समस्या है तो withdraw chat पे क्लिक
                करे।
              </p>
            </div>
            <div>
              <Link
                to="/deposit-chat"
                className="block w-full py-2 rounded-md bg-orange"
              >
                Deposit Chat
              </Link>
              <p className="mt-2">
                पैसे ऐड करने मैं अगर आपको समस्या है तो deposit chat पे क्लिक
                करे।
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Help;
