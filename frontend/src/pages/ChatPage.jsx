import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaDownload } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm Neuro Buddy. How are you feeling today? Feel free to share what's on your mind.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAYS9lW6js7de2lrpMn8mU7Zw2oB6DxQ_o"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Psychiatrist prompt context
  const systemContext = `You are NeuroBuddy, a mental health assistant specializing in psychological assessment. Your role is to:

1. Engage in supportive conversations to assess users' mental well-being through:

   - Analysis of their written responses

   - Observed emotional patterns

   - Reported physical and behavioral indicators

2. Guide conversations by:

   - Asking specific, open-ended questions to explore thoughts and feelings

   - Maintaining a warm, professional tone

   - Focusing on current mental state and immediate concerns

3. Document each interaction by:

   - Recording key observations about emotional state

   - Noting relevant behavioral patterns

   - Maintaining session summaries for continuity of care

   - Tracking changes from previous sessions

4. Important guidelines:

   - Keep responses clear and concise

   - Focus on gathering relevant information rather than providing therapy or treatments

   - Maintain professional boundaries while being empathetic

   - Document observations in a structured format

   - Don't provide long answers, make it shorter and concise

   - Don't ask many questions at the same time

   - Try to finish session within 15 min - 20 min

   - Don't entertain any demand of patient which is irrelevant to the session  `;
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    try {
      // Construct conversation history
      const conversationHistory = messages
        .map(
          (msg) => `${msg.sender === "bot" ? "Therapist" : "User"}: ${msg.text}`
        )
        .join("\n");

      // Generate response from Gemini
      const prompt = `${systemContext}\n\nConversation history:\n${conversationHistory}\n\nUser: ${input}\nTherapist:`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I apologize, but I'm having trouble responding right now. Could you please try again?",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndSession = () => {
    setSessionEnded(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Thank you for sharing with me today. Remember, I'm here whenever you need to talk. Take care!",
      },
    ]);
  };

  const downloadChatHistory = () => {
    const chatData = JSON.stringify(messages, null, 2);
    const blob = new Blob([chatData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "therapy-session.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="py-4 text-center text-lg font-semibold bg-gray-800 shadow-md">
        NeuroBuddy Therapy Session
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-md px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 self-end ml-auto"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-700 self-start px-4 py-2 rounded-lg"
          >
            <span className="animate-pulse">Typing...</span>
          </motion.div>
        )}
      </div>

      {!sessionEnded && (
        <div className="flex items-center p-4 bg-gray-800">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none resize-none"
            rows="2"
          />
          <motion.button
            onClick={handleSend}
            whileTap={{ scale: 0.9 }}
            className="ml-4 p-3 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition"
            disabled={isTyping}
          >
            <FaPaperPlane />
          </motion.button>
        </div>
      )}

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
          onClick={downloadChatHistory}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-4 mx-auto mb-6 flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          <FaDownload className="mr-2" />
          Download Chat History
        </motion.button>
      )}
    </div>
  );
};

export default ChatPage;
