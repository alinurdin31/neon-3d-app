import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Package, Boxes, FileText,
    BookOpen, DollarSign, TrendingDown, ClipboardList, Import,
    Settings, Users, Briefcase, List, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';

const Sidebar = () => {
    const { logout, user } = useData();
    const navGroups = [
        {
            title: 'UTAMA',
            items: [
                { path: '/', name: 'Dashboard', icon: LayoutDashboard },
                { path: '/pekerjaan', name: 'Pekerjaan (Jobs)', icon: Briefcase }, // New
            ]
        },
        {
            title: 'OPERASIONAL',
            items: [
                { path: '/pos', name: 'Kasir (POS)', icon: ShoppingCart },
                { path: '/produk', name: 'Produk', icon: Package },
                { path: '/stok', name: 'Stok', icon: Boxes },
                { path: '/pelanggan', name: 'Pelanggan', icon: Users }, // New
                { path: '/impor', name: 'Impor Data', icon: Import },
            ]
        },
        {
            title: 'KEUANGAN',
            items: [
                { path: '/laporan', name: 'Laporan', icon: FileText },
                { path: '/buku-besar', name: 'Buku Besar', icon: BookOpen },
                { path: '/coa', name: 'Daftar Akun (COA)', icon: List }, // New
                { path: '/gaji', name: 'Karyawan & Gaji', icon: DollarSign }, // Renamed
                { path: '/pengeluaran', name: 'Pengeluaran', icon: TrendingDown },
                { path: '/jurnal', name: 'Jurnal Umum', icon: ClipboardList },
            ]
        },
        {
            title: 'PENGATURAN',
            items: [
                { path: '/pengaturan', name: 'Pengaturan Toko', icon: Settings }, // New
            ]
        }
    ];

    return (
        <nav className="w-full h-full bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/10 flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-neon-cyan to-neon-purple rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.5)] animate-pulse" />
                <h1 className="text-xl font-bold tracking-wider font-neon text-white">
                    NEON <span className="text-neon-cyan">3D</span>
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-6">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative overflow-hidden
                    ${isActive
                                            ? 'text-white bg-white/5 shadow-[0_0_20px_rgba(0,243,255,0.1)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }
                  `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNav"
                                                    className="absolute left-0 top-0 w-1 h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
                                                />
                                            )}
                                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-neon-cyan' : 'group-hover:text-neon-cyan'}`} />
                                            <span className="font-medium text-sm">{item.name}</span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-neon-purple/20 to-transparent border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-xs font-bold text-neon-cyan border border-neon-cyan/30">
                        {user?.user_metadata?.display_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User'}</p>
                        <p className="text-[10px] text-neon-green flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;
