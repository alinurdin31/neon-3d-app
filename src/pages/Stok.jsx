import React from 'react';
import { AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { useData } from '../context/DataContext';

const Stok = () => {
    const { products } = useData();

    // Filter low stock
    const lowStockItems = products.filter(p => p.stock < 10);
    const inStockItems = products.filter(p => p.stock >= 10);

    // Inventory Value
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
    const totalRetailValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const potentialProfit = totalRetailValue - totalInventoryValue;

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold neon-text text-white mb-2">Monitor Stok</h1>
                <p className="text-gray-400">Pantau pergerakan stok dan nilai aset persediaan</p>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-t-4 border-neon-cyan">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="text-neon-cyan" />
                        <h3 className="text-gray-400 font-medium">Nilai Aset Persediaan</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatRupiah(totalInventoryValue)}</p>
                    <p className="text-xs text-gray-500 mt-1">Berdasarkan HPP (Cost)</p>
                </div>
                <div className="glass-card p-6 border-t-4 border-neon-purple">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-neon-purple" />
                        <h3 className="text-gray-400 font-medium">Potensi Keuntungan</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatRupiah(potentialProfit)}</p>
                    <p className="text-xs text-gray-500 mt-1">Jika semua stok terjual</p>
                </div>
                <div className="glass-card p-6 border-t-4 border-yellow-500">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="text-yellow-500" />
                        <h3 className="text-gray-400 font-medium">Perlu Restock</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{lowStockItems.length} Item</p>
                    <p className="text-xs text-gray-500 mt-1">Stok di bawah 10 unit</p>
                </div>
            </div>

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
                <div className="glass-card p-6 border border-yellow-500/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-yellow-500" /> Peringatan Stok Menipis
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-yellow-500/10 text-yellow-500 uppercase text-xs">
                                <tr>
                                    <th className="py-2 px-4 rounded-l-lg">Produk</th>
                                    <th className="py-2 px-4">Kategori</th>
                                    <th className="py-2 px-4 text-center">Sisa Stok</th>
                                    <th className="py-2 px-4 text-right rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {lowStockItems.map(p => (
                                    <tr key={p.id}>
                                        <td className="py-3 px-4 text-white font-medium">{p.name}</td>
                                        <td className="py-3 px-4 text-gray-400">{p.category}</td>
                                        <td className="py-3 px-4 text-center font-bold text-red-500">{p.stock}</td>
                                        <td className="py-3 px-4 text-right text-xs text-yellow-500 uppercase">{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Stock Table */}
            <div className="glass-card p-0 overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/10">
                    <h3 className="font-bold text-white">Semua Unit</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left min-w-[500px]">
                        <thead className="bg-black/20 text-gray-400 uppercase text-sm sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="py-3 px-6">Produk</th>
                                <th className="py-3 px-6 text-center">Stok Fisik</th>
                                <th className="py-3 px-6 text-right">Nilai (HPP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {inStockItems.map((prod) => (
                                <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-6 font-medium text-white">{prod.name}</td>
                                    <td className="py-3 px-6 text-center text-neon-cyan">{prod.stock}</td>
                                    <td className="py-3 px-6 text-right text-gray-400">{formatRupiah(prod.stock * prod.cost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stok;
