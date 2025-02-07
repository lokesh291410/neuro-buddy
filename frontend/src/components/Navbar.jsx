import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../public/logo.svg";
const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Logo & Name */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-semibold">Neuro Buddy</span>
      </div>

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Link to="/form">Form</Link>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          <Link to="/chat">Chat</Link>
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;
