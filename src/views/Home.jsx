import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/imgs/Logo.png";
import Deposit from "../assets/imgs/deposit.png";
import Whatsapp from "../assets/imgs/whatsapp.webp";
import Telegram from "../assets/imgs/telegram.png";
import BankImage from "../assets/imgs/bank.png";
import HelpImg from "../assets/imgs/help_img.png";
import OtherGameImg from "../assets/imgs/other_game.png";

import WithdrawImg from "../assets/imgs/withdraw_fund.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Timer from "../components/Timer";
import moment from "moment";

import Modal from '../components/Modal';
import { GameHistoryContext } from "../context/GameHistoryContext";
import { setBetModelCookie, getCookie } from "../utils/CookieGetSet";
import { deleteUserDataHistory } from "../repository/HistoryRepository";

import Play from '../views/Play';
import HomePageBanner from "../components/HomePageBanner";

const Home = () => {
  let { appData } = useSelector((state) => state.appData.appData);
  let { markets } = useSelector((state) => state.markets);
  let [isOpen, setOpen] = useState(true)
  let [isOpenBetCanceledModal, setOpenBetCanceledModal] = useState(true);
  const { historyData } = useContext(GameHistoryContext);

  const getCurrentDate = () => {
    return moment(moment.now()).format("YYYY-MM-DD");
  };

  useEffect(() => {
    document.title = "Home | Yogi Club777";
  }, [])

  const toggle = () => {
    setOpen(prevState => !prevState);
  };

  const toggleBetCanceledModal = () => {
    setBetModelCookie();
    setOpenBetCanceledModal(prevState => !prevState);
  }

  const clearData = () => {
    deleteUserDataHistory();
  }

  const isDisabled = true;


  return (
    <div className="py-3 px-1 pt-1 pb-5 bg-new-white">
      <marquee
        className="mt-1 rounded-md text-orange text-sm mb-1"
        scrollamount="6"
      >
        {appData?.home_message}
      </marquee>

      {/* Slider Banner */}
      {appData?.homepage_image_url &&
        <HomePageBanner bannerImageUrl={appData?.homepage_image_url} sliderUrl={appData?.slider_url} />
      }

      <div className="grid grid-cols-2 gap-2 mb-1">
        <div className="flex flex-col items-center justify-center">
          <Link to="/deposit-chat" className="flex items-center justify-center w-full px-2 py-2 mb-2 text-xs text-white bg-orange-300 rounded-full shadow-md bg-primary">
            <img className="me-2" style={{ width: "32px" , height: "32px" }} alt="HelpImg" src={HelpImg} /> Help Chat / सहायता चैट
          </Link>
          <Link to="/wallet?tab=addPoints" className="flex items-center justify-center w-full px-2 py-2 mb-2 text-xs text-white bg-orange-300 rounded-full shadow-md bg-primary">
            <img className="me-2" style={{ width: "32px" , height: "32px" }} alt="BankImage" src={BankImage} /> Add Funds / धन जोड़ें
          </Link>
        </div>
        <div className="flex flex-col justify-center">
          <a href={isDisabled ? undefined : appData?.result_history_webview_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full px-2 py-2 mb-2 text-xs text-white bg-primary-300 rounded-full shadow-md bg-primary">
            <img className="me-2" style={{ width: "32px" , height: "32px" }} alt="OtherGameImg" src={OtherGameImg} /> Other Game / अन्य खेल
            </a>
          <Link to="/wallet?tab=withdrawPoints" className="flex items-center justify-center w-full px-2 py-2 mb-2 text-xs text-white bg-orange-300 rounded-full shadow-md bg-primary">
            <img className="me-2" style={{ width: "32px" , height: "32px" }} alt="WithdrawImg" src={WithdrawImg} /> Withdrawal / निकासी
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {appData?.whatsapp_enable && (
           <div className="flex items-center gap-2 text-start">
            <a 
              href={`https://wa.me/${appData?.whatsapp_number}`} 
              target="_blank" 
              className="flex items-center gap-2 text-xs text-new-black"
            >
              <img className="h-5" alt="Whatsapp" src={Whatsapp} />
              +91 {appData?.whatsapp_number}
            </a>
          </div>
        )}
        {appData?.telegram_enable && (
          <div className="flex items-center justify-end gap-2 text-end">
           <a 
             href={appData?.telegram_link} 
             target="_blank" 
             className="flex items-center gap-2 text-xs text-new-black"
           >
             <img className="h-4" alt="Telegram" src={Telegram} />
             {appData?.telegram_link}
           </a>
         </div>
        )}
      </div>


      {/* Play Markets  */}
      <Play />

      
      
      {/* <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center">
          <Link to="/deposit-chat" className="inline-block">
            <img className="h-9" alt="Deposit" src={Deposit} />
          </Link>
          <Link to="/withdrawal-chat" className="inline-block">
            <img className="h-9" alt="Withdraw" src={Withdraw} />
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <img alt="Logo" src={Logo} className="h-20" />
        </div>
        <div className="flex flex-col justify-center">
          <a
            href={appData?.result_history_webview_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-full px-2 py-2 text-xs text-white bg-orange-300 rounded-md shadow-md bg-orange"
          >
            Other Game
          </a>
          <button onClick={clearData} className="flex items-center justify-center w-full px-2 py-2 mt-1 text-xs text-white bg-orange-300 rounded-md shadow-md bg-greenLight">
            Clear Data
          </button>
        </div>
      </div> */}
     
      {/* <div className="flex flex-col items-center justify-center p-2 mb-3 font-semibold text-center text-white bg-black border rounded-md shadow-sm">
        <div
          dangerouslySetInnerHTML={{
            __html: appData?.custom_message_1_homepage_1st,
          }}
        ></div>
        <Timer />
      </div> */}
      {/* <div className="flex flex-col items-center justify-center p-2 mb-3 font-semibold text-center text-black bg-white border rounded-md shadow-sm">
        <span className="text-sm">{markets?.current_result_card?.market?.name}</span>
        <span className="text-sm">Result</span>
        <span className="text-sm">{markets?.current_result_card?.result}</span>
      </div> */}
      {/* {
        appData?.result_history_webview_url && (
          <div className="flex flex-col items-center justify-center p-2 mb-3 font-semibold text-center text-white bg-primary/70 rounded-md">
            <span>🔥 सबसे पहले रिजल्ट देखने के लिए क्लिक करे 🔥</span>
            <a
              href={appData?.result_history_webview_url}
              rel="noreferrer"
              className="px-4 py-1 mt-2 rounded-2xl bg-orange"
              target="_blank"
              aria-label="View result history"
            >
              Click Link
            </a>
          </div>
        )
      } */}

      {/* <div
        className="flex flex-col justify-center p-2 mb-3 font-semibold text-center text-white bg-orange rounded-md"
        dangerouslySetInnerHTML={{
          __html: appData?.custom_message_2_homepage_2nd_note,
        }}
      ></div> */}
      {/* <div className="flex justify-center p-2 mb-2 font-semibold text-white rounded-md bg-greenLight">
      Yogi Club777 Live Result of {getCurrentDate()}
      </div> */}
      {/* <div className="flex items-center mb-2 text-xs text-white rounded-3xl bg-orange">
        <span className="px-2 font-semibold">Market Name/Time</span>
        <span className="flex flex-row gap-4 px-2 py-2 pr-4 ml-auto text-[10px] border-l border-black border-opacity-20">
          <span>
            Previous <br />
            Result
          </span>{" "}
          <span>
            Today
            <br /> Result
          </span>
        </span>
      </div> */}
      {/* {markets?.markets?.map((market, idx) => (
        <Link
          className="block p-3 py-1 mb-1 font-semibold bg-primary hover:bg-primary/70 rounded-md"
          key={idx}
          to={!market?.game_on ? "#" : `/play-game?gameType=${market?.name}&market_id=${market?.id}`}
        >
          <span className="text-sm font-semibold text-white">
            {market?.name}
          </span>
          <div className="grid items-end grid-cols-12 text-xs">
            <div className="flex flex-col col-span-3 text-white">
              <small>Open Time</small>
              <small>{market?.open_time}</small>
            </div>
            <div className="flex flex-col col-span-3 text-white">
              <small>Close Time</small>
              <small>{market?.close_time}</small>
            </div>
            <div className="flex flex-col col-span-2 text-white">
              <small>Result At</small>
              <small>{market?.result_time}</small>
            </div>
            <div className="flex flex-col col-span-4 text-white">
              <div className="grid grid-cols-2">
                <h3 className="text-xl font-bold text-right">
                  {market?.second_last_result?.result || "XX"}
                </h3>
                <h3 className="text-xl font-bold text-right">
                  {market?.last_result?.result || "XX"}
                </h3>
              </div>
            </div>
          </div>
        </Link>
      ))} */}
      {appData.info_dialog_1_message_show_hide &&
      <Modal isOpen={isOpen} toggle={toggle}>
        <div className='font-semibold relative text-black bg-white rounded-xl'>
          <img src={Logo} className="w-20 h-20 absolute left-1/2 z-9 -top-10 border-4 border-white rounded-full -translate-x-1/2" />
          <div className='flex justify-end p-3'>
            <button onClick={toggle}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M6 18 18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='p-3 text-center text-md'>
            <h3 className="text-orange text-2xl">Important</h3>
            <div>
              {appData.info_dialog_1_message}
            </div>
            <div className="pt-3">
              {appData.info_dialog_1_bottom_text}
            </div>
            <a href={appData.info_dialog_1_url} target="_blank" className="mt-8 mb-2 inline-block bg-primary py-1 px-8 text-white rounded-3xl">
              <span className="mr-2">🚀</span>Click me!
            </a>
          </div>
        </div>
      </Modal>
      }

      {getCookie('betModelHide') != 'true' && historyData.filter(dataItem => dataItem.status === 'CANCELED' && dataItem.date === new Date().toISOString().split('T')[0]).length > 0 &&
      <Modal isOpen={isOpenBetCanceledModal} toggle={toggleBetCanceledModal} style={{ width:'300px' }}>
        <div className='font-semibold relative text-black bg-white rounded-xl'>
          <div className='flex justify-end p-3'>
            <button onClick={toggleBetCanceledModal}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M6 18 18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='p-3 text-center text-md'>
            <h4 className="text-orange text-2xl">Your bet has been canceled.</h4>            
            <Link to={'/canceled-history'} className="mt-5 mb-2 inline-block bg-primary py-1 px-8 text-white rounded-3xl" style={{ background:'red' , fontSize:'13px' }}>
              <span className="mr-2"></span>Please check now
            </Link>
          </div>
        </div>
      </Modal>
      }
    </div>
  );
};

export default Home;
