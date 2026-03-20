import React, { Suspense } from "react";
import { routes } from "./routes/routes";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/Main.layout";
import { Toaster } from "react-hot-toast";

import Footer from "./components/Footer";

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <div className="App min-h-screen bg-[var(--bg-deep)]">
      <Toaster position="top-center" reverseOrder={false} />
      <MainLayout />

      <div className="flex-1 md:ml-[20%] mt-14 flex flex-col min-h-[calc(100vh-3.5rem)] transition-all duration-300">
        <div className="p-4 md:p-10 flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
