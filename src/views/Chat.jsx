import React, { useEffect, useState, useRef } from "react";
import DateSeparator from "../components/DateSeparator";
import { useLocation } from "react-router-dom";
import { getDepositMessages, getWithdrawMessages, sendDepositMessages, sendWithdrawMessages } from "../repository/ChatRepository";
import { toast } from "react-toastify";
import moment from 'moment'
import VoiceRecorder from "../components/VoiceRecorder";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";
import pusherJs from "pusher-js";

const ChatBubble = ({ isLeft, message, user }) => {
  return (
    <div className={`${isLeft ? 'ml-2' : 'mr-2'} text-xs`}>
      <div
        className={`relative w-8/12 p-4 ${isLeft ? "bg-[#a3a3a3] after:rotate-180 after:-left-5" : "bg-[#646464] ml-auto after:right-[-20px]"
          } text-white  after:border-[10px] after:top-4 after:border-t-transparent after:border-b-transparent after:border-r-transparent after:absolute ${isLeft ? "after:border-[#a3a3a3]" : "after:border-[#646464]"} rounded-2xl rounded-se-[3px]`}
      >
        <small className="flex">{isLeft ? "Admin" : user.name} ({moment(message.created_at).format("hh:mm A")})</small>
        <div className="flex flex-col items-start mt-3">
          {message.message}
          {message.file_type === "webm" ?
            <audio controls className="w-full mt-3">
              <source src={message.file_url}></source>
            </audio>
            : message.type === "image" ? <img className="mt-3" src={message.file_url} /> : message.type === "pdf" ? <a href={message.file_url} target="_blank" className="inline-flex items-center p-2 rounded-md bg-black/20 flex-col mt-3">
              <i class="fas fa-file fa-3x"></i>
              <span className="mt-1 uppercase">
                {message.type}</span>
              <small>Open File</small>
            </a> : ""}
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  let [dateGroupedMessages, setDateGroupedMessages] = useState({});
  let [loading, setLoading] = useState(false);
  let [file, setFile] = useState(undefined);
  let [fileType, setFileType] = useState("");
  let [chatId, setChatId] = useState(null);
  let { user, appData } = useSelector(state => state.appData.appData)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const [submitLoading, setSubmitLoading] = useState(false);
  const chatContainerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (location.pathname === "/deposit-chat") {
          let { data } = await getDepositMessages();
          if (data.error) {
            toast.error(data.message);
          } else {
            setMessages(data?.response?.chat?.messages || [])
            setChatId(data?.response?.chat?.id)
          }
        }
        else if (location.pathname === "/withdrawal-chat") {
          let { data } = await getWithdrawMessages();
          if (data.error) {
            toast.error(data.message);
          } else {
            setMessages(data?.response?.chat?.messages || [])
            setChatId(data?.response?.chat?.id)
          }
        }
      }
      catch (err) {
        toast.error(err.message);
      }
      finally {
        setLoading(false)
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let tempGroupedMessages = {};
    for (let posting of messages) {
      let date = moment(posting.created_at).format("YYYY/MM/DD");
      if (!Object.keys(tempGroupedMessages).includes(date)) {
        tempGroupedMessages[date] = [];
      }
      tempGroupedMessages[date].push(posting);
    }
    setDateGroupedMessages(tempGroupedMessages)
  }, [messages]);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [dateGroupedMessages]);

  useEffect(() => {
    if (chatId && appData) {
      var pusher = new pusherJs(appData.pusher_key, {
        cluster: appData.pusher_cluster
      });
      let subscribeId = `chats.${chatId}`;
      var channel = pusher.subscribe(subscribeId);
      channel.bind('message.sent', function (data) {
        let message = data.message;
        message.is_mine = message.user_id === user.id
        setMessages(prevState => {
          let tempMessages = [...prevState, message];
          return [...tempMessages]
        })
      });
    }
  }, [chatId, appData])

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      let payload = {
        file,
        fileType,
        message,
      }
      if (Object.values(payload).every(value => value === null || value === undefined || value === "")) {
        toast.error("Message cannot be empty!");
        return;
      }
      if (location.pathname === "/deposit-chat") {
        let { data } = await sendDepositMessages(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          setFile(undefined);
          setFileType("");
          setMessage("");
        }
      }
      else if (location.pathname === "/withdrawal-chat") {
        let { data } = await sendWithdrawMessages(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          toast.success(data.message)
          setFile(undefined);
          setFileType("");
          setMessage("");
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
    finally {
      setSubmitLoading(false)
    }
  }

  return (
    <form onSubmit={handleFileSubmit} className="relative h-full">

      <div ref={chatContainerRef} className="flex flex-col h-[calc(100dvh-56px-50px)] overflow-auto">
        {loading ? <div className="mt-4"><Spinner /></div> :
          Object.entries(dateGroupedMessages).map(([date, gamePostings]) => (
            <>
              <DateSeparator date={date} />
              <div className="flex flex-col gap-4 p-3">
                {gamePostings.map(message => (
                  <ChatBubble user={user} message={message} isLeft={!message.is_mine} key={message.id} />
                ))}
              </div>
            </>
          ))}
      </div>

      <div className="absolute gap-2 bottom-0 px-3 left-0 w-full h-[50px] bg-primary flex items-center">
        <input
          type="text"
          className="w-full px-3 py-1.5 rounded-md"
          placeholder="Type Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {file == null || fileType === "file" ?
          <label role="button" className={`w-10 relative flex justify-center items-center h-10 flex-shrink-0 bg-[#ebebeb] rounded-full cursor-pointer ${fileType === 'file' && file !== null ? "after:rounded-full after:w-2 after:h-2 after:absolute after:bg-red-800 after:top-0.5 after:right-0.5 after:z-50" : ""}`}>
            <input onChange={(e) => {
              setFile(e.target.files[0]);
              setFileType("file")
            }} type="file" className="hidden" />
            <i className="fas fa-paperclip"></i>
          </label>
          : ""}
        {file == null || fileType === "voice" ?
          <VoiceRecorder recorded={fileType === "voice" && file !== null} onRecorded={(blob) => {
            setFileType("voice");
            const file = new File([blob], `audio.webm`, {
              type: blob.type,
              lastModified: new Date().getTime()
            })
            setFile(file);
          }} /> : ""}
        <button type="submit" disabled={submitLoading || loading} className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white rounded-full bg-greenLight">
          {submitLoading ? <Spinner size={10} /> : <svg
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
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>}

        </button>
      </div>
    </form>
  );
};

export default Chat;
