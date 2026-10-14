import {Outlet} from '@tanstack/react-router';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/Sidebar';
import {useEffect, useState} from 'react';
import {useNavigate} from '@tanstack/react-router';
import {useAuthContext} from '@/context/AuthContext';

const AppLayout = () => {
  const navigate = useNavigate();
  const {isAuthenticated, user} = useAuthContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if (!token && !isAuthenticated) {
  //     navigate({to: '/signin'});
  //   }
  // }, [isAuthenticated, navigate]);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B8860B] border-t-transparent"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-bg-light-mint font-sans">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        {/* Mobile sidebar overlay backdrop */}
        {/* {sidebarOpen && (
          <div
            className="bg-primary-navy/50 fixed inset-0 z-[9998] backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )} */}

        {/* Main content area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden pt-0">
          {/* Mobile top bar with hamburger */}
          {/* <header className="flex items-center gap-3 bg-primary-navy px-4 py-3 lg:hidden sticky top-0 z-50 shadow-md"> */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-pure-white/10 flex h-9 w-9 items-center justify-center rounded-lg text-pure-white transition-colors hover:bg-accent-teal"
            aria-label="Toggle Sidebar"
          >
            {/* <Menu className="h-5 w-5" /> */}
          </button>
          {/* <span className="text-sm font-semibold mt-0 pt-0 text-pure-white tracking-wide">
              MedCode Ninja
            </span> */}
          {/* </header> */}

          <main>
            <div className="m-0 min-h-screen w-full p-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
