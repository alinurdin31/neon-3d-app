import React, { useState } from 'react';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const COA = () => {
    const { accounts, journal, addAccount, updateAccount, deleteAccount } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', type: 'Asset' });

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Calculate Balances
    const accountsWithBalance = accounts.map(acc => {
        let balance = 0;
        journal.forEach(entry => {
            entry.lines.forEach(line => {
                if (line.code === acc.code) {
                    if (['Asset', 'Expense'].includes(acc.type)) {
                        balance += (line.debit - line.credit);
                    } else {
                        balance += (line.credit - line.debit);
                    }
                }
            });
        });
        return { ...acc, balance };
    });

    // Columns
    const columns = [
        { header: 'Kode Akun', accessor: 'code', render: (acc) => <span className="font-mono text-neon-purple">{acc.code}</span> },
        { header: 'Nama Akun', accessor: 'name', render: (acc) => <div className="font-medium text-white">{acc.name}</div> },
        {
            header: 'Saldo Saat Ini',
            accessor: 'balance',
            render: (acc) => <span className={`font-mono font-bold ${acc.balance < 0 ? 'text-red-500' : 'text-white'}`}>{formatRupiah(acc.balance)}</span>
        },
        {
            header: 'Tipe',
            accessor: 'type',
            render: (acc) => (
                <span className={`px-2 py-1 rounded text-xs border font-bold ${acc.type === 'Asset' ? 'border-neon-green text-neon-green bg-neon-green/10' :
                    acc.type === 'Liability' ? 'border-neon-pink text-neon-pink bg-neon-pink/10' :
                        acc.type === 'Equity' ? 'border-neon-purple text-neon-purple bg-neon-purple/10' :
                            acc.type === 'Revenue' ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' :
                                acc.type === 'Expense' ? 'border-neon-pink text-neon-pink bg-neon-pink/10' :
                                    'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                    }`}>
                    {acc.type}
                </span>
            )
        },
        {
            header: 'Aksi',
            render: (acc) => (
                <div className="flex justify-end gap-2">
                    <button
                        title="Edit"
                        onClick={() => openModal(acc)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        title="Hapus"
                        onClick={() => handleDelete(acc.code)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const openModal = (acc = null) => {
        if (acc) {
            setEditingAccount(acc);
            setFormData(acc);
        } else {
            setEditingAccount(null);
            setFormData({ code: '', name: '', type: 'Asset' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAccount) {
            updateAccount(editingAccount.code, formData);
        } else {
            // Check for duplicate code
            if (accounts.some(a => a.code === formData.code)) {
                alert('Kode akun sudah ada!');
                return;
            }
            addAccount(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (code) => {
        if (window.confirm('Hapus akun ini? Pastikan tidak ada transaksi yang terkait.')) {
            deleteAccount(code);
        }
    };

    return (
        <div className="space-y-6">
            <DataTable
                title="Daftar Akun (COA)"
                columns={columns}
                data={accountsWithBalance}
                onAdd={() => openModal()}
                searchPlaceholder="Cari nama atau kode akun..."
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Kode Akun</label>
                        <input
                            type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan disabled:opacity-50"
                            placeholder="Contoh: 1-1100"
                            disabled={!!editingAccount}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Nama Akun</label>
                        <input
                            type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            placeholder="Contoh: Kas Kecil"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Tipe Akun</label>
                        <select
                            value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                        >
                            <option value="Asset">Asset (Harta)</option>
                            <option value="Liability">Liability (Kewajiban)</option>
                            <option value="Equity">Equity (Modal)</option>
                            <option value="Revenue">Revenue (Pendapatan)</option>
                            <option value="Expense">Expense (Beban)</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default COA;
