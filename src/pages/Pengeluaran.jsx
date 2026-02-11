import React, { useState } from 'react';
import { Plus, Trash2, TrendingDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Pengeluaran = () => {
    const { transactions, setTransactions, addJournalEntry, accounts } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ desc: '', amount: 0, expenseAccountCode: '', method: '1-1100' });

    // Filter expenses
    const expenses = transactions.filter(t => t.type === 'Pengeluaran');

    // Get valid expense accounts
    const expenseAccounts = accounts.filter(a => a.type === 'Expense');

    // Default to first expense account if available
    if (!formData.expenseAccountCode && expenseAccounts.length > 0) {
        setFormData(prev => ({ ...prev, expenseAccountCode: expenseAccounts[0].code }));
    }

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Columns
    const columns = [
        { header: 'ID Transaksi', accessor: 'id', render: (t) => <span className="font-mono text-neon-purple">{t.id}</span> },
        { header: 'Tanggal', accessor: 'date', render: (t) => <span className="text-gray-400">{t.date}</span> },
        { header: 'Keterangan', accessor: 'desc', render: (t) => <div className="font-medium text-white">{t.desc}</div> },
        { header: 'Kategori', accessor: 'category', render: (t) => <span className="text-xs bg-white/10 px-2 py-1 rounded">{t.category}</span> },
        { header: 'Jumlah', accessor: 'total', render: (t) => <span className="text-neon-pink font-bold">{formatRupiah(t.total)}</span> },
        {
            header: 'Aksi',
            render: (tx) => (
                <div className="flex justify-end">
                    <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 hover:bg-white/10 rounded text-gray-500 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const txId = `EXP-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        const amount = Number(formData.amount);

        const selectedAccount = accounts.find(a => a.code === formData.expenseAccountCode);
        const categoryName = selectedAccount ? selectedAccount.name : 'Operasional';

        const newTx = {
            id: txId,
            date,
            type: 'Pengeluaran',
            desc: formData.desc,
            total: amount,
            category: categoryName
        };
        setTransactions(prev => [newTx, ...prev]);

        addJournalEntry({
            date,
            desc: `Biaya: ${formData.desc}`,
            ref: txId,
            lines: [
                { code: formData.expenseAccountCode, debit: amount, credit: 0 },
                { code: formData.method, debit: 0, credit: amount }
            ]
        });

        setIsModalOpen(false);
        setFormData({ desc: '', amount: 0, expenseAccountCode: expenseAccounts[0]?.code || '', method: '1-1100' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus riwayat pengeluaran ini? (Jurnal tidak otomatis terhapus untuk keamanan audit)')) {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <DataTable
                title="Pengeluaran & Biaya"
                columns={columns}
                data={expenses}
                onAdd={() => setIsModalOpen(true)}
                searchPlaceholder="Cari pengeluaran..."
            />

            {/* Expense Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Catat Pengeluaran Baru"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Keterangan Biaya</label>
                        <input
                            type="text"
                            required
                            value={formData.desc}
                            onChange={e => setFormData({ ...formData, desc: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-pink"
                            placeholder="Contoh: Bayar Listrik Bulan Ini"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Jumlah Biaya (Rp)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-pink"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Kategori Akun Biaya</label>
                        <select
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-pink"
                            value={formData.expenseAccountCode}
                            onChange={e => setFormData({ ...formData, expenseAccountCode: e.target.value })}
                        >
                            {expenseAccounts.map(acc => (
                                <option key={acc.code} value={acc.code}>{acc.code} - {acc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Sumber Dana</label>
                        <select
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-pink"
                            value={formData.method}
                            onChange={e => setFormData({ ...formData, method: e.target.value })}
                        >
                            <option value="1-1100">Kas Tunai (1-1100)</option>
                            <option value="1-1110">Bank BCA (1-1110)</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-neon-pink text-white font-bold rounded-lg hover:bg-pink-600">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Pengeluaran;
