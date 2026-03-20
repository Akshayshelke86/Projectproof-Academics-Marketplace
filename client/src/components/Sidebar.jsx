import React from "react";
import { Link } from "react-router-dom";
import { sidebarConstant } from "../constants/sidebar";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

const Sidebar = ({ handleItemClick, activeItem, isOpen, toggleSidebar }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Filter sidebar items based on role
  // Filter sidebar items based on role
  const filteredSidebar = sidebarConstant.filter(item => {
    // 1. Always Visible Items (Public)
    if (['Home', 'Marketplace'].includes(item.name)) return true;

    // Must be logged in for anything else
    if (!userInfo) return false;

    // 2. Admin/Guide: See Everything
    if (userInfo.role === 'admin' || userInfo.role === 'guide') return true;

    // 3. Specific Role Checks
    if (item.name === 'Projects') {
      // Only Admin/Guide can see Review Queue
      return false;
    }

    if (item.name === 'Submit Project' || item.name === 'My Wallet') {
      // STRICTLY ONLY Students (Sellers) can Submit & See Wallet
      return userInfo.role === 'student' || userInfo.isFreelancer;
    }

    if (item.name === 'Dashboard') {
      // Hide Dashboard for Clients (Buyers), unrelated for them mostly
      // Show only for Student (Seller) or Admin
      return userInfo.role !== 'client';
    }

    // Wishlist is for everyone logged in
    return true;
  });

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 w-[70%] max-w-[280px] md:w-[20%] mt-0 md:mt-16 border-r border-[var(--border-color)] glass-nav z-50 transition-transform duration-300 transform md:translate-x-0 bg-[var(--bg-surface)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Mobile Header with Close Button */}
        <div className="flex md:hidden items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Menu</h2>
          <button onClick={toggleSidebar} className="text-[var(--text-dim)] hover:text-red-500 transition-colors">
            <MdClose size={24} />
          </button>
        </div>

        <div className="px-4 py-6 flex flex-col gap-2 relative h-full">
          {filteredSidebar.map((element, index) => (
            <Link
              key={index}
              to={element.path}
              className={`flex items-center gap-4 py-3 px-4 rounded-xl cursor-pointer transition-colors duration-200 group ${activeItem === element.name
                ? "bg-[var(--primary-glow)]/10 text-[var(--primary-glow)] border-r-2 border-[var(--primary-glow)]"
                : "text-[var(--text-dim)] hover:bg-[var(--text-dim)]/5 hover:text-[var(--text-main)]"
                }`}
              onClick={() => handleItemClick(element.name)}
            >
              <element.icon size={22} className={`${activeItem === element.name ? 'text-[var(--primary-glow)]' : 'group-hover:text-[var(--text-main)]'}`} />
              <p className="font-medium tracking-wide">{element.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
