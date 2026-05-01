import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();

  // Change "/login" to "/get-started"
  const isAuthPage = location.pathname === "/get-started";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navbar will only render if we are NOT on the get-started page */}
      {!isAuthPage && <Navbar />}
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;