import React, { useEffect, useState, useRef } from "react";
import DateSeparator from "../components/DateSeparator";
import ChatBubble from "../components/ChatBubble";
import { getGroupPostingMessages, sendGroupPostingMessages } from "../repository/ChatRepository";
import { toast } from "react-toastify";
import moment from "moment";
import Spinner from '../components/Spinner'
import pusherJs from "pusher-js";
import { useSelector } from "react-redux";

const GamePosting = () => {
  let [dateGroupedMessages, setDateGroupedMessages] = useState({})
  let [messages, setMessages] = useState([]);
  let [loading, setLoading] = useState(false);
  let [submissionLoading, setSubmissionLoading] = useState(false);
  let [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);
  const { appData, user } = useSelector(state => state.appData.appData);


  useEffect(() => {
    document.title = "Game Posting | Yogi Club777"
    const fetchGroupPostingMessages = async () => {
      try {
        setLoading(true);
        let { data } = await getGroupPostingMessages();
        if (data.error) {
          toast.error(data.message);
        } else {
          setMessages(data?.response?.groupPostings);

        }
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchGroupPostingMessages();
  }, [])

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
    if (appData) {
      console.log(appData);
      var pusher = new pusherJs(appData.pusher_key, {
        cluster: appData.pusher_cluster
      });
      var channel = pusher.subscribe('group.posted');
      console.log("test")
      channel.bind('group.posted', function (data) {
        console.log(data)
        let message = data.groupPost;
        message.is_mine = message?.user?.id === user.id
        setMessages(prevState => {
          let tempMessages = [...prevState, message];
          return [...tempMessages]
        })
      });
      console.log("pusher")
    }
  }, [appData])

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmissionLoading(true)
      let payload = {
        message
      }
      let { data } = await sendGroupPostingMessages(payload);
      if (data.error) {
        toast.error(data.message)
      } else {
        toast.success(data.message);
        setMessage("");
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmissionLoading(false)
    }
  }

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [dateGroupedMessages])

  return (
    <div className="relative h-full">

      <div ref={chatContainerRef} className="flex flex-col h-[calc(100dvh-56px-50px)] overflow-auto">
        {loading ? <div className="mt-4"><Spinner /></div> :
          Object.entries(dateGroupedMessages).map(([date, gamePostings]) => (
            <>
              <DateSeparator date={date} />
              <div className="flex flex-col gap-4 p-3">
                {gamePostings.map(message => (
                  <ChatBubble isLeft={!message.is_mine} message={message} key={message.id} />
                ))}
              </div>
            </>
          ))}
      </div>

      <form onSubmit={handleMessageSubmit} className="absolute gap-3 bottom-0 px-3 left-0 w-full h-[50px] bg-primary flex items-center">
        <input
          type="text"
          required
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          className="w-full px-3 py-1.5 rounded-md"
          placeholder="Type Message"
        />
        <button disabled={submissionLoading || loading} type="submit" className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white rounded-full bg-greenLight">
          {submissionLoading ? <Spinner size={10} /> : <svg
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
      </form>
    </div>
  );
};

export default GamePosting;
