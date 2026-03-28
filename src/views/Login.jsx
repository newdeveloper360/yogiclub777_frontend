import React, { useEffect, useState } from "react";
import Logo from "../assets/imgs/Logo.png";
import Splash from "./Splash";
import { sendLoginOtp, verifyLoginOtp, submitReferralCode } from "../repository/AuthRepository";
import Repository from "../repository/Repository";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InstallButton from "../components/InstallButton";
import Modal from "../components/Modal";

const Login = () => {
  let [loading, setLoading] = useState();
  let [isSplash, setSplash] = useState(true);
  let [isOTPScreen, setOTPScreen] = useState(false);
  let [phone, setPhone] = useState("");
  let [otp, setOTP] = useState("");
  let [isReferralModalOpen, setReferralModalOpen] = useState(false);  // Modal state
  let [referralCode, setReferralCode] = useState("");  // Referral code state
  let [isSubmittingReferral, setSubmittingReferral] = useState(false);  // Referral submission state
   let navigate = useNavigate();
  let { appData } = useSelector(state => state.appData.appData);

  useEffect(() => {
    window.setTimeout(() => {
      setSplash(false);
    }, 200);

    // Admin login as a user
    const urlParms = new URLSearchParams(window.location.search)
    const token = urlParms.get('token')
    
    // Save referral code from URL to localStorage
    const urlReferralCode = urlParms.get('referral_code')
    if (urlReferralCode) {
      localStorage.setItem("referral_code", urlReferralCode);
    }
    
    // Pre-fill referral code from localStorage if available
    const savedReferralCode = localStorage.getItem("referral_code");
    if (savedReferralCode) {
      setReferralCode(savedReferralCode);
    }
    
    if (token) {
      localStorage.setItem("authToken", token);
      window.location.href = "/"
    }
        
  }, []);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = {
        phone,
      };
      let { data } = await sendLoginOtp(payload);
      if (data.error === false) {
        setOTPScreen(true);
      } else {
        toast.error(data.message);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = { phone, otp };
      let { data } = await verifyLoginOtp(payload);
      if (data.error === false) {
        let { token, user } = data.response;
        Repository.defaults.headers.Authorization = "Bearer " + token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));

        if (data?.response?.newUser) {
          if(appData?.invite_system_enable === 1){
            setReferralModalOpen(true); 
          } else {
            window.location.href = "/";
          }
        } else {
          window.location.href = "/";
        }
      } else {
        toast.error(data.message);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleReferralSubmit = async () => {
    setSubmittingReferral(true);

    try {
      if (referralCode.trim() !== "") {
        let payload = { refer_code: referralCode };
        let { data } = await submitReferralCode(payload);

        if (data.error === false) {
          // Clear referral code from localStorage after successful submission
          localStorage.removeItem("referral_code");
          setReferralModalOpen(false);
          window.location.href = "/";
        } else {
          toast.error("Invalid referral code.");
        }
      }


    } catch (error) {
      toast.error("Failed to apply referral code.");
    } finally {
      setSubmittingReferral(false);
    }
  };

  const skipReferral = () => {
    // Clear referral code from localStorage when skipped
    localStorage.removeItem("referral_code");
    setReferralModalOpen(false);
    window.location.href = "/";
  };


  return isSplash ? (
    <Splash />
  ) : (
    <div
      style={{
        background:
          "linear-gradient(153deg, rgba(2,0,36,1) 0%, #7564AB 35%, #7564AB 100%)",
      }}
      className="flex flex-col justify-center h-full p-3"
    >
      <div className="p-4 font-bold text-center bg-white rounded-md text-greenLight">
          फरीदाबाद गाजियाबाद गली देसावर खेलने वाले एप्लिकेशन डाउनलोड करे
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <a
            href={appData.video_link_iphone}
            target="_blank"
          className="flex flex-col items-center p-4 text-center text-red-500 bg-white rounded-md"
        >
          iPhone मैं डाउनलोड करने के लिए वीडियो देखें
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
              className="w-12 h-12"
            fill="#c38e00"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
        </a>
        <a
            href={appData.video_link_android}
            target="_blank"
          className="flex flex-col items-center p-4 text-center text-red-500 bg-white rounded-md"
        >
          ANDROID मैं डाउनलोड करने के लिए वीडियो देखें
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
              className="w-12 h-12"
            fill="#c38e00"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
        </a>
      </div>
      <div className="relative flex flex-col p-5 mt-12 bg-white rounded-md">
        <img
          src={Logo}
          alt="Logo"
          className="absolute w-20 h-20 -translate-x-1/2 -top-10 left-1/2"
        />
        {isOTPScreen ? (
          <form onSubmit={handleOTPSubmit}>
            <div className="flex flex-col w-full mt-4">
              <label>OTP</label>
              <input
                className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                  type="number"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="block w-full p-3 mt-2 font-semibold text-white rounded-md bg-orange"
            >
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhoneSubmit}>
            <div className="flex flex-col w-full mt-4">
              <label>Mobile Number</label>
              <input
                className="block w-full h-10 px-2 py-1 mt-1 text-black border rounded border-black/40"
                    type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="block w-full p-3 mt-2 font-semibold text-white rounded-md bg-orange"
            >
              {loading ? <Spinner /> : "Send OTP"}
            </button>
          </form>
        )}
          <hr className="mt-4 border-black/40" />
          <InstallButton />
          <a target="_blank" href={appData?.app_update_link} className="p-3 mt-2 flex justify-center font-semibold text-white rounded-md bg-orange">
          Install Android Application
          </a>
      </div>




      <Modal isOpen={isReferralModalOpen} toggle={() => setReferralModalOpen(false)}>
        <div className="w-full p-5 text-center">
          <h2 className="mb-4 text-xl font-bold">Enter Referral Code <span className="text-[12px]">(Optional)</span></h2>
          <input
            type="number"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full p-3 mb-4 border border-black/40 rounded-md"
            placeholder="Referral Code"
          />
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={skipReferral}
              className="w-full px-4 py-2 font-semibold text-white bg-gray-500 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleReferralSubmit}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg"
              disabled={isSubmittingReferral}
            >
              {isSubmittingReferral ? <Spinner /> : "Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
