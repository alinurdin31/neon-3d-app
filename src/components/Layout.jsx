import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNavbar from './MobileNavbar';
import { useData } from '../context/DataContext';
import { Loader2 } from 'lucide-react';

const Layout = ({ children }) => {
    const { loading } = useData();
    // Initialize based on screen width to default open on desktop, closed on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex relative overflow-x-hidden">

            {/* Mobile Backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 relative w-full ${!isMobile && isSidebarOpen ? 'ml-64' : 'ml-0'
                } p-4 md:p-8 pt-4 pb-24 md:pb-8`}> {/* Added pb-24 for mobile nav spacing */}

                {/* Desktop Toggle Button - Hidden on Mobile since we have Bottom Nav */}
                <button
                    onClick={toggleSidebar}
                    className="hidden md:block absolute top-4 left-4 z-40 p-2 bg-black/50 hover:bg-neon-cyan/80 text-white rounded-lg backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all group"
                >
                    {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Background glow effects */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                            <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
                            <p className="text-gray-400 font-medium animate-pulse">Sinkronisasi Cloud...</p>
                        </div>
                    ) : children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
    );
};

export default Layout;
