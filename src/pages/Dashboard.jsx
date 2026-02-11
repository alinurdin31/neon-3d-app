import React from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="glass-card p-6 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300">
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-${color}/20 blur-2xl group-hover:bg-${color}/30 transition-all duration-500`} />

        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg bg-${color}/10 text-${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>

        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white tracking-wide">{value}</p>
    </div>
);

const Dashboard = () => {
    const { transactions, journal, products } = useData();

    const salesTransactions = transactions.filter(t => t.type === 'Penjualan');
    const totalRevenue = salesTransactions.reduce((acc, t) => acc + t.total, 0);
    const totalOrders = salesTransactions.length;

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Ringkasan Dashboard</h1>
                    <p className="text-gray-400">Data Langsung dari Sistem Integrasi</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Pendapatan"
                    value={formatRupiah(totalRevenue)}
                    change={0}
                    icon={DollarSign}
                    color="neon-cyan"
                />
                <StatCard
                    title="Total Produk"
                    value={products.length}
                    change={0}
                    icon={Users}
                    color="neon-purple"
                />
                <StatCard
                    title="Pesanan Penjualan"
                    value={totalOrders}
                    change={0}
                    icon={Activity}
                    color="neon-pink"
                />
                <StatCard
                    title="Entri Jurnal"
                    value={journal.length}
                    change={0}
                    icon={TrendingUp}
                    color="neon-green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6 min-h-[400px]">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="text-neon-cyan" />
                        Entri Jurnal Terakhir
                    </h2>
                    <div className="space-y-4">
                        {journal.slice(0, 5).map((entry, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded flex justify-between items-center">
                                <div>
                                    <p className="text-neon-purple font-mono text-sm">{entry.id}</p>
                                    <p className="text-white">{entry.desc}</p>
                                </div>
                                <span className="text-gray-400 text-sm">{entry.date}</span>
                            </div>
                        ))}
                        {journal.length === 0 && <p className="text-gray-500">Belum ada data jurnal.</p>}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Aktivitas Transaksi</h2>
                    <div className="space-y-4">
                        {transactions.slice(0, 5).map((t, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${t.type === 'Penjualan' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-pink/20 text-neon-pink'}`}>
                                    {t.type === 'Penjualan' ? 'IN' : 'OUT'}
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">{t.desc || `Pesanan ${t.id}`}</h4>
                                    <p className="text-gray-400 text-xs">{t.date}</p>
                                </div>
                                <span className={`ml-auto text-xs font-bold ${t.type === 'Penjualan' ? 'text-neon-cyan' : 'text-neon-pink'}`}>
                                    {formatRupiah(t.total)}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && <p className="text-gray-500">Belum ada transaksi.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
