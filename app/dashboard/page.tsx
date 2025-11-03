"use client";
import { MessageSquareReply, RefreshCcw } from 'lucide-react'; 
import { useEffect, useState } from "react";
import axios from 'axios'

interface Message {
  id: string;
  contactId: string;
  content: string;
  channel: string;
  direction: string;
  status: string;
  createdAt: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendMsgContent, setSendMsgContent] = useState({
    to: '',
    message: '',
    channel: 'whatsapp'
  })

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchMessages();

    const intervalId = setInterval(() => {
      fetchMessages();
      console.log('refreshing...');
    }, 2000); 

    return () => clearInterval(intervalId);

  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className='flex justify-between'>
        <div className='flex items-center space-x-2.5'>
          <h2 className="text-blue-600 text-3xl font-bold mb-6">Inbox</h2>
          <RefreshCcw className='cursor-pointer animate-spin' size={28} style={{marginBottom:'15px'}}/>
        </div>
        <button onClick={openModal} className='flex items-center border bg-blue-200 rounded-lg p-1.5 w-[75px] h-[32px] space-x-4 cursor-pointer'>
          Reply <MessageSquareReply size={24}/>
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center text-gray-500">
          No messages yet
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition">
              <span className=" text-black">{msg.contact?.name || msg.contact?.phone}</span>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-gray-900">{msg.contactId}</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  msg.channel === "sms" ? "bg-blue-100 text-blue-800" :
                  msg.channel === "whatsapp" ? "bg-green-100 text-green-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {msg.channel.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{msg.content}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{msg.direction}</span>
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <ReplyModal isModalOpen={isModalOpen} closeModal={closeModal}/>
    </div>
  );
}

const ReplyModal = ({isModalOpen, closeModal}) => {
  const [isSending, setIsSending] = useState(false)
  const [payload, setPayload] = useState({
    to: '',
    message: '',
    channel: 'whatsapp'
  })
  const handleSendMessage = async () => {
    try {
      setIsSending(true)
      const response = await fetch("/api/twilio/send-message", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('response', response)
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      closeModal(); 
      setIsSending(false)
    }
  }
  return (<div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 font-sans">
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg p-8 mx-4 bg-white rounded-2xl shadow-xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send New Message</h3>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="tel"
                    id="to"
                    value={payload.to}
                    onChange={(e) => setPayload({
                      ...payload,
                      to: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-1">
                    Channel
                  </label>
                  <select
                    id="channel"
                    value={"whatsapp"}
                    onChange={(e) => setPayload({
                      ...payload,
                      channel: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={payload.message}
                    onChange={(e) => setPayload({
                      ...payload,
                      message: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out forwards;
        }
      `}</style>
    </div>)
}