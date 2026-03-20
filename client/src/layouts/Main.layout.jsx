import React, { useState } from "react";
import MainNavBar from "../components/MainNavBar";
import Sidebar from "../components/Sidebar";
import ChatBot from "../components/ChatBot";

const MainLayout = ({ }) => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsSidebarOpen(false); // Close sidebar on mobile when item clicked
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <MainNavBar
          toggleTheme={toggleTheme}
          isDarkMode={darkMode}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div>
        <Sidebar
          activeItem={activeItem}
          handleItemClick={handleItemClick}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <ChatBot />
    </>
  );
};

export default MainLayout;
