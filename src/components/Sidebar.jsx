import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/imgs/Logo.png";
import Chat from "../assets/imgs/chat.png";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import InstallButton from "../components/InstallButton";

const Sidebar = ({ toggleSideBar }) => {
  let location = useLocation();
  let { appData, user } = useSelector((state) => state.appData.appData);
  console.log("result_history_webview_url", appData?.result_history_webview_url);

  let [logoutModal, setLogoutModal] = useState(false);
  let links = [
    {
      text: "Home / होम",
      to: "/",
      icon: (className) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className={className}
          fill="currentColor"
        >
          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"></path>
          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
        </svg>
      ),
      iconType: "svg",
    },
    {
      to: "/history",
      text: "My Play History",
      description: "अपनी खेली हुई गेम देखने के लिए यहाँ दबाये",
      icon: require("../assets/imgs/swords.png"),
      iconType: "img",
    },
    {
      to: appData?.whatsapp_group_join_link ? appData?.whatsapp_group_join_link : "#",
      text: "Whatsapp Channel",
      description: "Whatsapp Channel पे क्लिक करे",
      icon: require("../assets/imgs/whatsapp.webp"),
      iconType: "img",
    },
    // {
    //   to: "/canceled-history",
    //   text: "Canceled Bet",
    //   description: "All Canceled Bet",
    //   icon: require("../assets/imgs/canceled.png"),
    //   iconType: "img",
    // },
    // {
    //   to: "/game-posting",
    //   text: "Game Posting",
    //   description: "गेम की गैसिंग देखने के लिए यहां दबाए",
    //   icon: require("../assets/imgs/game.png"),
    //   iconType: "img",
    // },
    {
      to: "/bonus-report",
      text: "Refer & Earn",
      description: "कमीशन देखने के लिए यहाँ दबाये",
      icon: require("../assets/imgs/bonus.png"),
      iconType: "img",
    },
    ...(appData?.result_history_webview_url ? [{
      to: "/result-history",
      text: "Result History",
      description: "गेम के रिजल्ट देखने के लिए यहाँ दबाये",
      icon: require("../assets/imgs/history.png"),
      iconType: "img",
    }] : []),
    {
      text: "Terms and Condition",
      to: "/terms-and-condition",
      description: "नियम एवं शर्ते",
      icon: require("../assets/imgs/connection.png"),
      iconType: "img",
    },
    {
      text: "Share",
      // onClick: async (e) => {
      //   e.preventDefault();
      //   const shareText = `Share this Amazing game app with your friends! Use My Refer Code: ${user?.own_code}`;
      //   // const shareUrl = "https://yogiclub777.com";
      //   const shareUrl = `https://new.yogiclub777.com/auth/login?referral_code=${user?.own_code}`;

      //   if (navigator.share) {
      //     try {
      //       await navigator.share({
      //         title: 'Share',
      //         text: shareText,
      //         url: shareUrl,
      //       });
      //     } catch (error) {
      //       console.error('Error sharing:', error);
      //     }
      //   } else {
      //     // Fallback for browsers not supporting Web Share API
      //     if (navigator.clipboard) {
      //       try {
      //         await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      //         alert('Link and message copied to clipboard. You can paste it into your preferred sharing app.');
      //       } catch (error) {
      //         console.error('Error copying to clipboard:', error);
      //       }
      //     } else {
      //       // Clipboard API not supported
      //       alert('Unable to copy link. Please try sharing manually.');
      //     }
      //   }
      // },

      onClick: async (e) => {
        e.preventDefault();
      
        const shareText = `Share this Amazing game app with your friends! Use My Refer Code: ${user?.own_code}`;
        const shareUrl = `https://new.yogiclub777.com/auth/login?referral_code=${user?.own_code}`;
        const fullMessage = encodeURIComponent(shareText + " " + shareUrl);
      
        // ✅ ANDROID + CHROME + PWA - Web Share API
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'YogiClub777',
              text: shareText,
              url: shareUrl,
            });
            return;
          } catch (err) {
            console.log("Share cancelled");
          }
        }
      
        // ✅ FALLBACK FOR ANDROID WEBVIEW APK
        // Detect if running in Android WebView
        const isAndroidWebView = /wv|WebView/.test(navigator.userAgent) || 
          (navigator.userAgent.includes('Android') && navigator.userAgent.includes('Version/'));
        
        if (isAndroidWebView) {
          // Use Android Intent URL - opens WhatsApp natively without affecting WebView history
          const intentUrl = `intent://send?text=${fullMessage}#Intent;package=com.whatsapp;scheme=whatsapp;end`;
          
          // Create hidden iframe to trigger intent without navigation
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = intentUrl;
          document.body.appendChild(iframe);
          
          // Cleanup iframe after short delay
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
          
          return;
        }
        
        // ✅ FALLBACK FOR OTHER PLATFORMS (Desktop, iOS, etc.)
        const whatsappUrl = `https://wa.me/?text=${fullMessage}`;
        
        // Use location.href with setTimeout to avoid history issues
        const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        
        // If popup blocked, try whatsapp:// protocol
        if (!newWindow || newWindow.closed) {
          window.location.href = `whatsapp://send?text=${fullMessage}`;
        }
      },
      
      description: "जो भाई गली दिसावर प्ले करते है व्हाट्सअप पर शेयर करे",
      icon: (className) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className={className}
          fill="currentColor"
        >
          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
        </svg>
      ),
      iconType: "svg",
    },
    // {
    //   text: "Rate our app",
    //   description: "हमारी एप्लिकेशन को सुझाव देने के लिए दबाये",
    //   icon: require("../assets/imgs/rate.png"),
    //   iconType: "img",
    //   to: appData?.rate_app_link,
    //   external: true,
    // },
    {
      onClick: (e) => {
        e.preventDefault();
        setLogoutModal(true);
        toggleSideBar()
      },
      text: "Logout",
      icon: require("../assets/imgs/logout.png"),
      iconType: "img",
    },
  ];
  const handleKeyDown = (e) => {
    if (e.keyCode === 27 && document.body.classList.contains("sidebar-open"))
      toggleSideBar();
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  let [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(prevState => !prevState)
  }
  return (
    <>
      <Modal isOpen={logoutModal} toggle={() => {
        setLogoutModal(prevState => !prevState);
      }}>
        <div className='font-semibold text-black bg-white'>
          <div className='flex justify-end p-3 border-b border-black'>
            <button onClick={() => {
              setLogoutModal(prevState => !prevState);
            }}>
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
          <div className="w-11/12 max-w-[480px] p-3">
            Are You sure you want to logout?
            <div className="mt-4 flex gap-4 justify-end">
              <button onClick={() => {
                localStorage.clear();
                window.location.href = "/auth/login";
                document.title = "Yogi Club777"
              }} className="py-1 px-3 bg-red-400 rounded-md">Logout</button>
              <button onClick={() => {
                setLogoutModal(false)
              }} className="py-1 px-3 bg-primary rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="absolute z-20 transition-all top-0 group-[.sidebar-open]/body:left-0 -left-full w-full h-[100dvh] bg-black/40">
        <div
          onClick={toggleSideBar}
          className="absolute top-0 z-0 w-full h-full cursor-pointer"
        ></div>
        <div className="absolute z-10 w-4/6 h-full bg-white text-white shadow-2xl ">
          <div className="p-5 bg-new-white">
            <div onClick={toggleSideBar} className="flex justify-end w-full">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-new-black"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full">
                    <img src={Logo} className="w-full h-full" alt="Logo" />
                  </div>
                </div>
                <div className="ml-3 text-sm">
                  <h4 className="text-new-black">
                    <strong>Name:</strong> {user?.name}
                  </h4>
                  <h4 className="opacity-80 text-new-black">
                    <strong>ID:</strong> {user?.phone}
                  </h4>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={toggleSideBar}
                className="flex items-center justify-center py-2 mt-2 text-white rounded-full shadow-lg bg-primary"
              >
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="h-[calc(100dvh-192px)] overflow-auto">
            {links.map((link, idx) =>
              link.onClick ? (
                <a
                  onClick={link.onClick}
                  href={"/"}
                  className={`group/link flex items-center px-4 py-3 transition-all border-b-2 border-white hover:pl-4 h-16 border-opacity-40 bg-new-white`}
                >
                  {link.iconType === "svg" ? (
                    link.icon("w-6 h-6 flex-shrink-0 text-new-black")
                  ) : link.iconType === "img" ? (
                    <img
                      src={link.icon}
                      className="w-6 h-6"
                      alt={link.title}
                    />
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col">
                    <span className={`ml-2 text-sm text-new-black group-hover/link:text-orange transition-colors ${location.pathname === link.to ? "!text-orange" : ""}`}>{link.text}</span>
                    {link.description && (
                      <span className={`ml-2 text-xs text-new-black group-hover/link:text-orange transition-colors ${location.pathname === link.to ? "!text-orange" : ""}`}>
                        {link.description}
                      </span>
                    )}
                  </div>
                </a>
              ) : link.external ? (
                <a
                  href={link.to}
                  target="_blank"
                  className={`group/link flex items-center px-4 py-3 transition-all border-b-2 border-white shadow-inner hover:pl-4 h-20 border-opacity-40 bg-new-white`}
                >
                  {link.iconType === "svg" ? (
                    link.icon("w-6 h-6 flex-shrink-0 text-new-black")
                  ) : link.iconType === "img" ? (
                    <img

                      src={link.icon}
                      className="w-6 h-6 flex-shrink-0"
                      alt={link.title}
                    />
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col">
                    <span className={`ml-2 text-sm text-new-black group-hover/link:text-orange transition-colors ${location.pathname === link.to ? "!text-orange" : ""}`}>{link.text}</span>
                    {link.description && (
                      <span className={`ml-2 text-xs text-new-black group-hover/link:text-orange transition-colors ${location.pathname === link.to ? "!text-orange" : ""}`}>
                        {link.description}
                      </span>
                    )}
                  </div>
                </a>
              ) : (
                <Link
                  to={link.to || "#"}
                  key={`SidebarItemNo${idx}`}
                  onClick={toggleSideBar}
                  className={`group/link flex items-center px-4 py-3 transition-all border-b-2 border-white !pl-4 h-14 border-opacity-40 bg-new-white`}
                >
                  {link.iconType === "svg" ? (
                    link.icon("w-6 h-6 flex-shrink-0 text-new-black")
                  ) : link.iconType === "img" ? (
                    <img
                      src={link.icon}
                      className="w-6 h-6 flex-shrink-0"
                      alt={link.title}
                    />
                  ) : (
                    ""
                  )}
                  <div className="flex flex-col">
                    <span className={`ml-2 text-sm text-new-black group-hover/link:text-orange transition-colors ${location.pathname === link.to ? "!text-orange" : ""}`}>{link.text}</span>
                    {link.description && (
                      <span className={`ml-2 text-xs text-new-black group-hover/link:text-orange transition-colors ${location.pathname === link.to ? "!text-orange" : ""}`}>
                        {link.description}
                      </span>
                    )}
                  </div>
                </Link>
              )
            )}
            <div className="p-2 text-[9px] font-semibold text-center text-black bg-new-white hidden">
              <div className="grid grid-cols-3 gap-2">
                <div onClick={() => { toggle(); toggleSideBar() }} className="flex flex-col items-center">
                  <img src={Chat} alt="Chat" className="w-14 h-14" />
                  <p className="mt-1">हमसे बात करने के लिए चैट पे क्लिक करे</p>
                </div>
                <a
                  href={appData?.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center"
                >
                  <div className="bg-[#4267b2] flex items-center justify-center rounded-full w-14 h-14">
                    <i className="text-4xl text-white fab fa-facebook"></i>
                  </div>
                  <p className="mt-1">
                    सॉलिड गेम के लिए हमारा फेसबुक ग्रुप ज्वाइन करे
                  </p>
                </a>
                <a
                  href={appData?.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center"
                >
                  <div
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                    }}
                    className="flex items-center justify-center rounded-full w-14 h-14"
                  >
                    <i className="text-4xl text-white fab fa-instagram"></i>
                  </div>
                  <p className="mt-1">इंस्टाग्राम पर फॉलो करे</p>
                </a>
              </div>
              <a
                className="inline-block mt-3 text-blue-400 underline"
                href={window.location.origin}
              >
                {window.location.origin}
              </a>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default Sidebar;
