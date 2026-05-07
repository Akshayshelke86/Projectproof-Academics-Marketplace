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
    <div className="flex justify-center h-[76px] px-4 md:px-10 py-0 bg-[var(--bg-surface)] border-b border-[var(--border-color)] sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="flex items-center justify-between w-full 2xl:max-w-6xl h-full gap-4">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="md:hidden text-[var(--text-main)] hover:text-[var(--primary)] transition-colors">
            <MdMenu size={28} />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-1 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <MdBolt className="text-white text-xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[var(--text-main)] transition-colors duration-300">
              Project<span className="text-gradient-1 italic">Proof</span>
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 ml-10">
          <Link to="/" className="text-sm font-bold text-[var(--text-dim)] hover:text-[var(--primary)] transition-all">Home</Link>
          <Link to="/marketplace" className="text-sm font-bold text-[var(--text-dim)] hover:text-[var(--primary)] transition-all">Marketplace</Link>
          {userInfo && (userInfo.role === 'student' || userInfo.isFreelancer) && (
            <Link to="/submit-project" className="text-sm font-bold text-[var(--text-dim)] hover:text-[var(--primary)] transition-all">Submit Project</Link>
          )}
          {userInfo && (userInfo.role === 'admin' || userInfo.role === 'guide') && (
            <Link to="/projects" className="text-sm font-bold text-[var(--text-dim)] hover:text-[var(--primary)] transition-all">Review Queue</Link>
          )}
        </div>

        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="p-2.5 rounded-full bg-[var(--bg-deep)] hover:bg-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors duration-300 border border-[var(--border-color)]">
            {isDarkMode ? <MdLightMode size={20} className="text-yellow-500" /> : <MdDarkMode size={20} className="text-indigo-600" />}
          </button>

          {userInfo ? (
            <div className="flex items-center gap-5">
              <span className="text-sm font-semibold text-[var(--text-dim)] hidden md:block">Hi, <span className="text-[var(--text-main)] font-bold">{userInfo.name}</span></span>
              <button
                onClick={logoutHandler}
                className="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-5 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <div className="flex items-center gap-2 btn-colorful px-6 py-2.5 rounded-xl cursor-pointer">
                <p className="font-bold text-sm">Login / Register</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainNavBar;
