import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaDownload } from "react-icons/fa";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [sessionEnded, setSessionEnded] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { sender: "user", text: input },
      { sender: "bot", text: "Got it! How else can I help?" },
    ];
    setMessages(newMessages);
    setInput("");
  };

  const handleEndSession = () => {
    setSessionEnded(true);
    console.log("Chat Data:", JSON.stringify(messages, null, 2));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Chat Header */}
      <div className="py-4 text-center text-lg font-semibold bg-gray-800 shadow-md">
        Neuro Buddy Chat
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 self-end ml-auto"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      {/* Chat Input */}
      {!sessionEnded && (
        <div className="flex items-center p-4 bg-gray-800">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none"
          />
          <motion.button
            onClick={handleSend}
            whileTap={{ scale: 0.9 }}
            className="ml-4 p-3 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition"
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      )}

      {/* End Session Button (Animated) */}
      {!sessionEnded ? (
        <motion.button
          onClick={handleEndSession}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-4 mx-auto mb-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition"
        >
          End Session
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-4 mx-auto mb-6 flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          <FaDownload className="mr-2" />
          Download Chat JSON
        </motion.button>
      )}
    </div>
  );
};

export default ChatPage;
