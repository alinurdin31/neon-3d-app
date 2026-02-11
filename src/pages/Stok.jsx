import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Package, Archive, History } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Stok = () => {
    const { products, journal, restockProduct } = useData();
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [restockForm, setRestockForm] = useState({ id: null, name: '', qty: 1, cost: 0, method: '1-1100' });
    const [viewMode, setViewMode] = useState('inventory'); // 'inventory' or 'history'

    // Metrics
    const lowStockItems = products.filter(p => p.stock < 10);
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);
    const purchaseHistory = journal.filter(j => j.ref && j.ref.startsWith('PUR-'));

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    // Columns for Inventory
    const inventoryColumns = [
        {
            header: 'Produk',
            accessor: 'name',
            render: (p) => (
                <div>
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.category}</div>
                </div>
            )
        },
        {
            header: 'Stok Fisik',
            accessor: 'stock',
            render: (p) => (
                <span className={`font-bold ${p.stock < 10 ? 'text-red-500' : 'text-neon-cyan'}`}>
                    {p.stock} Unit
                </span>
            )
        },
        {
            header: 'Nilai Aset (HPP)',
            accessor: 'totalValue',
            render: (p) => <span className="text-gray-400">{formatRupiah(p.stock * p.cost)}</span>
        },
        {
            header: 'Aksi',
            render: (p) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => openRestockModal(p)}
                        className="flex items-center gap-2 px-3 py-1 bg-neon-green/10 text-neon-green rounded hover:bg-neon-green/20 transition-colors border border-neon-green/20"
                    >
                        <Archive className="w-3 h-3" /> Restock
                    </button>
                </div>
            )
        }
    ];

    // Columns for History
    const historyColumns = [
        { header: 'ID Referensi', accessor: 'ref', render: (h) => <span className="font-mono text-neon-purple">{h.ref}</span> },
        { header: 'Tanggal', accessor: 'date' },
        { header: 'Keterangan', accessor: 'desc' },
        {
            header: 'Total Pembelian',
            accessor: 'total',
            render: (h) => {
                // Find credit amount (Cash/Bank) to show total
                const creditLine = h.lines.find(l => l.credit > 0);
                return <span className="text-neon-cyan font-bold">{formatRupiah(creditLine ? creditLine.credit : 0)}</span>;
            }
        }
    ];

    // Actions
    const openRestockModal = (prod) => {
        setRestockForm({ id: prod.id, name: prod.name, qty: 1, cost: prod.cost, method: '1-1100' });
        setIsRestockModalOpen(true);
    };

    const handleRestockSubmit = (e) => {
        e.preventDefault();
        const totalCost = restockForm.qty * restockForm.cost;
        restockProduct(
            { id: restockForm.id, name: restockForm.name },
            restockForm.qty,
            restockForm.cost,
            totalCost,
            restockForm.method === '1-1100' ? 'Cash' : restockForm.method === '1-1110' ? 'Bank' : 'Cash'
        );
        setIsRestockModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Monitor Stok</h1>
                    <p className="text-gray-400">Pantau pergerakan stok dan nilai aset persediaan</p>
                </div>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setViewMode('inventory')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'inventory' ? 'bg-neon-cyan text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Persediaan
                    </button>
                    <button
                        onClick={() => setViewMode('history')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'history' ? 'bg-neon-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Riwayat Pembelian
                    </button>
                </div>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-t-4 border-neon-cyan">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="text-neon-cyan" />
                        <h3 className="text-gray-400 font-medium">Nilai Aset Persediaan</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{formatRupiah(totalInventoryValue)}</p>
                </div>
                <div className="glass-card p-6 border-t-4 border-yellow-500">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="text-yellow-500" />
                        <h3 className="text-gray-400 font-medium">Perlu Restock</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{lowStockItems.length} Item</p>
                </div>
                <div className="glass-card p-6 border-t-4 border-neon-purple">
                    <div className="flex items-center gap-3 mb-2">
                        <History className="text-neon-purple" />
                        <h3 className="text-gray-400 font-medium">Total Pembelian</h3>
                    </div>
                    <p className="text-2xl font-bold text-white">{purchaseHistory.length} Transaksi</p>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'inventory' ? (
                <>
                    {lowStockItems.length > 0 && (
                        <div className="glass-card p-6 border border-yellow-500/30 bg-yellow-500/5">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-500" /> Peringatan Stok Menipis
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {lowStockItems.map(p => (
                                    <div key={p.id} className="bg-black/40 border border-yellow-500/30 p-4 rounded-lg flex justify-between items-center px-4">
                                        <div>
                                            <h4 className="font-bold text-white">{p.name}</h4>
                                            <p className="text-xs text-gray-400">Sisa: <span className="text-red-500 font-bold text-lg">{p.stock}</span></p>
                                        </div>
                                        <button onClick={() => openRestockModal(p)} className="p-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30">
                                            <Archive className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <DataTable
                        title="Daftar Persediaan"
                        columns={inventoryColumns}
                        data={products}
                        searchPlaceholder="Cari produk..."
                    />
                </>
            ) : (
                <DataTable
                    title="Riwayat Pembelian (Restock)"
                    columns={historyColumns}
                    data={purchaseHistory}
                    searchPlaceholder="Cari ID ref..."
                />
            )}

            {/* Restock Modal */}
            <Modal
                isOpen={isRestockModalOpen}
                onClose={() => setIsRestockModalOpen(false)}
                title="Restock Produk"
            >
                <form onSubmit={handleRestockSubmit} className="space-y-4">
                    <p className="text-gray-400 font-mono text-sm border-b border-white/10 pb-4">Product: <span className="text-white font-bold">{restockForm.name}</span></p>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Jumlah Beli (Qty)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={restockForm.qty}
                            onChange={e => setRestockForm({ ...restockForm, qty: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Harga Beli Satuan (Update Cost)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={restockForm.cost}
                            onChange={e => setRestockForm({ ...restockForm, cost: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Sumber Dana Pembelian</label>
                        <select
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green"
                            value={restockForm.method}
                            onChange={e => setRestockForm({ ...restockForm, method: e.target.value })}
                        >
                            <option value="1-1100">Kas Tunai (1-1100)</option>
                            <option value="1-1110">Bank BCA (1-1110)</option>
                        </select>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg mt-4">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Total Pembelian</span>
                            <span className="text-white font-bold">{formatRupiah(restockForm.qty * restockForm.cost)}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 text-center">Akan tercatat: Dr Persediaan, Cr Kas/Bank</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsRestockModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400">Konfirmasi</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Stok;
