import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaArrowLeft } from "react-icons/fa";

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    try {
      const chatData = location.state?.chatData || [];

      const prompt = `
        Analyze this therapy session chat and create a comprehensive report in markdown format.
        Format the report with these sections:

        # Mental Health Session Report
        ## Session Overview
        [Provide a brief summary of the session]

        ## Key Discussion Points
        [List main topics discussed]

        ## Emotional Assessment
        [Analyze emotional state and patterns]

        ## Behavioral Observations
        [Note significant behavioral patterns]

        ## Risk Assessment
        [Any concerns or risk factors identified]

        ## Recommendations
        [Suggest next steps and coping strategies]

        ## Follow-up Plan
        [Outline recommended follow-up actions]

        Chat transcript to analyze:
        ${chatData.map((msg) => `${msg.role}: ${msg.content}`).join("\n")}
      `;

      const result = await model.generateContent(prompt);
      const reportContent = result.response.text();
      setReport(reportContent);
    } catch (error) {
      console.error("Report generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-xl font-semibold">Generating Your Report...</p>
              <p className="text-sm text-gray-400">This may take a moment</p>
            </div>
          </motion.div>
        )}

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => navigate("/chat")}
                className="flex items-center text-gray-400 hover:text-white transition"
              >
                <FaArrowLeft className="mr-2" />
                Back to Chat
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
              >
                <FaDownload className="mr-2" />
                Download Report
              </motion.button>
            </div>

            {/* Report Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-8 shadow-2xl"
            >
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mb-6 text-blue-400">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-300">
                        {children}
                      </h2>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-300">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 text-gray-300">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => <li className="mb-2">{children}</li>,
                  }}
                >
                  {report}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ReportPage;
