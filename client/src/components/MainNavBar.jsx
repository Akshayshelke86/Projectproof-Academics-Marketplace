import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import UserLogo from "../assets/user.png";
import { logout } from "../services/user/UserLoginSlice";
import { MdBolt, MdMenu, MdDarkMode, MdLightMode } from "react-icons/md";

const MainNavBar = ({ toggleTheme, isDarkMode, toggleSidebar }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div className="flex justify-center h-16 px-4 md:px-10 py-0 glass-nav border-b border-[var(--border-color)] sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-[var(--bg-card)]">
      <div className="flex items-center justify-between w-full 2xl:max-w-6xl h-full gap-4">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="md:hidden text-[var(--text-main)] hover:text-[var(--primary-glow)] transition-colors">
            <MdMenu size={28} />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300">
              <MdBolt className="text-white text-xl" />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-[var(--text-main)]">
              Project<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 italic">Proof</span>
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 ml-10">
          <Link to="/" className="text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text-main)] hover:drop-shadow-[0_0_5px_rgba(56,189,248,0.5)] transition-all">Home</Link>
          <Link to="/marketplace" className="text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text-main)] hover:drop-shadow-[0_0_5px_rgba(56,189,248,0.5)] transition-all">Marketplace</Link>
          {userInfo && (userInfo.role === 'student' || userInfo.isFreelancer) && (
            <Link to="/submit-project" className="text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text-main)] hover:drop-shadow-[0_0_5px_rgba(56,189,248,0.5)] transition-all">Submit Project</Link>
          )}
          {userInfo && (userInfo.role === 'admin' || userInfo.role === 'guide') && (
            <Link to="/projects" className="text-sm font-medium text-[var(--text-dim)] hover:text-[var(--text-main)] hover:drop-shadow-[0_0_5px_rgba(56,189,248,0.5)] transition-all">Review Queue</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--bg-card)] text-[var(--text-main)] transition-colors">
            {isDarkMode ? <MdLightMode size={22} className="text-yellow-400" /> : <MdDarkMode size={22} className="text-blue-500" />}
          </button>

          {userInfo ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--text-dim)] hidden md:block">Welcome, <span className="text-cyan-400 font-bold">{userInfo.name}</span></span>
              <button
                onClick={logoutHandler}
                className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-1.5 rounded-lg font-semibold hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all text-xs tracking-wide"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link to="/login">
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2 shadow-lg shadow-cyan-500/20 rounded-lg cursor-pointer hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300">
                <p className="text-white font-bold text-sm tracking-wide">Login / Register</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainNavBar;
