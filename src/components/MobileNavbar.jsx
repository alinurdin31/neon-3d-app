import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, FileText, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNavbar = ({ isSidebarOpen, toggleSidebar }) => {
    const navItems = [
        { path: '/', name: 'Home', icon: LayoutDashboard },
        { path: '/pos', name: 'Kasir', icon: ShoppingCart },
        { path: '/produk', name: 'Produk', icon: Package },
        { path: '/laporan', name: 'Laporan', icon: FileText },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden pb-safe">
            <div className="flex justify-around items-center p-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative
              ${isActive ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileNav"
                                        className="absolute inset-0 bg-neon-cyan/10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]' : ''}`} />
                                <span className="text-[10px] font-bold">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Toggle Sidebar Button */}
                <button
                    onClick={toggleSidebar}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative ${isSidebarOpen ? 'text-neon-purple' : 'text-gray-400 hover:text-white'}`}
                >
                    {isSidebarOpen && (
                        <motion.div
                            layoutId="mobileNav"
                            className="absolute inset-0 bg-neon-purple/10 rounded-xl"
                        />
                    )}
                    {isSidebarOpen ? <X className="w-6 h-6 mb-1" /> : <Menu className="w-6 h-6 mb-1" />}
                    <span className="text-[10px] font-bold">Menu</span>
                </button>
            </div>
        </div>
    );
};

export default MobileNavbar;
