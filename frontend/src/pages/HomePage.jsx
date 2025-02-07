import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();
  const [showMale, setShowMale] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Toggle between Male and Female with interval
  useEffect(() => {
    const interval = setInterval(() => {
      setShowMale((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDBNIDAgMjAgTCA0MCAyMCBNIDIwIDAgTCAyMCA0MCBNIDAgMzAgTCA0MCAzMCBNIDMwIDAgTCAzMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmMTAiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

        {/* Content container with parallax effect */}
        <motion.div
          className="relative z-10 text-center px-4"
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          {/* Floating and Crossfading Images */}
          <div className="absolute inset-0 -top-32 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              {showMale ? (
                <motion.img
                  key="male"
                  src="https://i.ibb.co/KpdknGfc/male.png"
                  alt="Male Avatar"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{
                    opacity: 0.15,
                    scale: 1,
                    rotate: 0,
                    y: [0, -10, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{
                    duration: 0.8,
                    y: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="w-64 h-64 object-contain filter blur-[1px]"
                />
              ) : (
                <motion.img
                  key="female"
                  src="https://i.ibb.co/0VDv2DkZ/female.png"
                  alt="Female Avatar"
                  initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  animate={{
                    opacity: 0.15,
                    scale: 1,
                    rotate: 0,
                    y: [0, -10, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  transition={{
                    duration: 0.8,
                    y: {
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="w-64 h-64 object-contain filter blur-[1px]"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Glowing effect behind heading */}
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />

          {/* Main Content */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold mb-6 relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
              Welcome to
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400">
              Neuro Buddy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 relative"
          >
            Your AI-powered mental wellness assistant
          </motion.p>

          <motion.button
            onClick={() => navigate("/form")}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden group"
          >
            <span className="relative z-10">Book Your Session</span>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;
