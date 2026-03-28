import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDepositMessages, getWithdrawMessages } from "../repository/ChatRepository";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const FloatingMenu = () => {
  let { appData } = useSelector((state) => state.appData.appData);
  let location = useLocation();
  const [lastVisitedHelp, setLastVisitedHelp] = useState(() => {
    return localStorage.getItem('lastVisitedHelp') || null;
  });
  const [messageCount, setMessagesCount] = useState(0);

  let items = [
    {
      text: "My Play History / मेरे खेल इतिहास",
      link: "/history",
      icon: (
        <img
        src={require("../assets/imgs/game.png")}
        alt="Play"
        className="w-4 h-4"
        />        
      ),
    },
    {
      text: "Result / परिणाम",
      link: "/result-history",
      icon: (
        <img
          src={require("../assets/imgs/history.png")}
          alt="Play"
          className="w-4 h-4"
        />
      ),
    },
    {
      text: "Home",
      link: "/",
      icon: (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-white bg-yellow-color rounded-full p-1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
      ),
    },
    {
      text: "Refresh / रीफ्रेश",
      link: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
        </svg>
      ),
    },
    {
      text: "Support / सहायता",
      link: `https://wa.me/${appData?.whatsapp_number}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      ),
    },
  ];

  const style = {
    marginLeft: "3px",
    borderRadius: "2px",
    padding: "0px 3px",
    background: "red",
    fontSize: "8px",
    color: "#fff",
    fontWeight: "bold",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depositRes = await getDepositMessages();
        let depositMessages = [];
        if (!depositRes.data.error) {
          depositMessages = depositRes?.data?.response?.chat?.messages || [];
        } else {
          toast.error(depositRes.data.message);
        }

        const withdrawRes = await getWithdrawMessages();
        let withdrawMessages = [];
        if (!withdrawRes.data.error) {
          withdrawMessages = withdrawRes?.data?.response?.chat?.messages || [];
        } else {
          toast.error(withdrawRes.data.message);
        }

        // Combine both message arrays
        const allMessages = [...depositMessages, ...withdrawMessages];

        // Count only messages after lastVisitedHelp
        let newMessages = allMessages;
        if (lastVisitedHelp) {
          newMessages = allMessages.filter(msg => {
            const msgTime = new Date(msg.created_at);
            const lastSeen = new Date(lastVisitedHelp);
            return msgTime > lastSeen;
          });
        }

        setMessagesCount(newMessages.length);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (localStorage.getItem("authToken")) {
      fetchData();
    }
  }, [lastVisitedHelp]);
  
  return (
    // <div className="absolute z-10 flex items-center py-1 bg-white border shadow-black/20 border-black/5 left-0 right-0 bottom-0 justify-evenly" style={{height: "70px"}}>
    //   {items.map((item, idx) => (
    //     <Link
    //       to={item.link || "#"}
    //       key={`FloatingMenuItem${idx}`}
    //       className={`flex w-20 h-11 flex-col ${location.pathname === item.link ? 'text-orange' : 'text-new-black'} items-center  rounded-md py-0.5 px-1`}

    //       onClick={() => {
    //         if (item.text === 'Help') {
    //           const now = new Date().toISOString();
    //           setLastVisitedHelp(now);
    //           localStorage.setItem('lastVisitedHelp', now);
    //           setMessagesCount(0); 
    //         }
    //       }}
    //     >
    //       {item.icon}
    //       <span className="mt-auto text-[10px]">{item.text}
    //       {item.text === 'Help' && messageCount > 0 && (
    //         <small style={style}>{messageCount}</small>
    //       )}
    //       </span>
    //     </Link>
    //   ))}
    // </div>

    <div className="absolute z-10 flex items-center py-0 bg-white border shadow-black/20 border-black/5 left-0 right-0 bottom-0 justify-evenly" style={{height: "64px"}}>
      {items.map((item, idx) => {
        const [text_en, text_hi] = item.text.split(" / "); // <-- Split English + Hindi

        return (
          <Link
            to={item.link || "#"}
            key={`FloatingMenuItem${idx}`}
            className={`flex w-21 h-12 flex-col items-center justify-center ${
              location.pathname === item.link ? "text-orange" : "text-new-black"
            }`}
            onClick={() => {
              if (text_en === "Help") {
                const now = new Date().toISOString();
                setLastVisitedHelp(now);
                localStorage.setItem("lastVisitedHelp", now);
                setMessagesCount(0);
              }
              if (text_en === "Refresh") {
                window.location.reload();
              }
            }}
          >
            {item.icon}

            <span className="text-[11px] leading-tight text-center mt-1">
              {text_en}<br/>
              <small className="text-[10px] opacity-90">{text_hi}</small>

              {text_en === "Help" && messageCount > 0 && (
                <small style={style}>{messageCount}</small>
              )}
            </span>

          </Link>
        );
      })}
    </div>

  );
};

export default FloatingMenu;
