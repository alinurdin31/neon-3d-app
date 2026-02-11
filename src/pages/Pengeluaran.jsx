import React, { useState } from 'react';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import { useData } from '../context/DataContext';

const Pengeluaran = () => {
    const { transactions, setTransactions, addJournalEntry } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ desc: '', amount: 0, category: 'Operasional', method: '1-1100' });

    const expenses = transactions.filter(t => t.type === 'Pengeluaran');

    const handleSubmit = (e) => {
        e.preventDefault();
        const txId = `EXP-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        const amount = Number(formData.amount);

        const newTx = {
            id: txId,
            date,
            type: 'Pengeluaran',
            desc: formData.desc,
            total: amount,
            category: formData.category
        };
        setTransactions(prev => [newTx, ...prev]);

        // Journal: Dr Expense (6xxxx), Cr Cash/Bank (1xxxx)
        // Hardcoded Expense Code for now: 6-3000 (Beban Operasional Lainnya)

        addJournalEntry({
            date,
            desc: `Biaya: ${formData.desc}`,
            ref: txId,
            lines: [
                { code: '6-3000', debit: amount, credit: 0 },
                { code: formData.method, debit: 0, credit: amount }
            ]
        });

        setIsModalOpen(false);
        setFormData({ desc: '', amount: 0, category: 'Operasional', method: '1-1100' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus riwayat pengeluaran ini?')) {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Pengeluaran & Biaya</h1>
                    <p className="text-gray-400">Catat biaya operasional sehari-hari</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-neon-pink/20 hover:bg-neon-pink/30 text-neon-pink border border-neon-pink rounded-lg shadow-[0_0_15px_rgba(255,0,255,0.2)] transition-all font-medium">
                    <Plus className="w-5 h-5" />
                    Catat Pengeluaran
                </button>
            </header>

            <div className="glass-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 uppercase text-sm">
                                <th className="py-4 px-6">ID Transaksi</th>
                                <th className="py-4 px-6 hidden md:table-cell">Tanggal</th>
                                <th className="py-4 px-6">Keterangan</th>
                                <th className="py-4 px-6 text-right">Jumlah</th>
                                <th className="py-4 px-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {expenses.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-6 font-mono text-neon-purple">{tx.id}</td>
                                    <td className="py-4 px-6 text-gray-400 hidden md:table-cell">{tx.date}</td>
                                    <td className="py-4 px-6 text-white font-medium">{tx.desc}</td>
                                    <td className="py-4 px-6 text-right text-neon-pink font-bold">{formatRupiah(tx.total)}</td>
                                    <td className="py-4 px-6 text-right">
                                        <button onClick={() => handleDelete(tx.id)} className="p-2 hover:bg-white/10 rounded text-gray-500 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><TrendingDown className="text-neon-pink" /> Catat Pengeluaran Baru</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Keterangan Biaya</label>
                                    <input type="text" required value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-pink" placeholder="Contoh: Beli Kertas Struk" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Jumlah Biaya (Rp)</label>
                                    <input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-pink" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Sumber Dana</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-pink"
                                        value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value })}
                                    >
                                        <option value="1-1100">Kas Tunai (1-1100)</option>
                                        <option value="1-1110">Bank BCA (1-1110)</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                                    <button type="submit" className="px-6 py-2 bg-neon-pink text-white font-bold rounded-lg hover:bg-pink-600">Simpan Pengeluaran</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Pengeluaran;
