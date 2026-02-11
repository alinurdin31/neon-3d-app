import React, { useState } from 'react';
import { Plus, Edit, Trash2, List } from 'lucide-react';
import { useData } from '../context/DataContext';

const COA = () => {
    const { accounts, addAccount, updateAccount, deleteAccount } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', type: 'Asset' });

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
            addAccount(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (code) => {
        if (window.confirm('Hapus akun ini?')) {
            deleteAccount(code);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Daftar Akun (COA)</h1>
                    <p className="text-gray-400">Manajemen Chart of Accounts untuk Akuntansi</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-medium">
                    <Plus className="w-5 h-5" />
                    Tambah Akun
                </button>
            </header>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-gray-400 uppercase text-sm">
                            <th className="py-4 px-6">Kode Akun</th>
                            <th className="py-4 px-6">Nama Akun</th>
                            <th className="py-4 px-6">Tipe</th>
                            <th className="py-4 px-6 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {accounts.sort((a, b) => a.code.localeCompare(b.code)).map((acc) => (
                            <tr key={acc.code} className="hover:bg-white/5 transition-colors group">
                                <td className="py-4 px-6 font-mono text-neon-purple">{acc.code}</td>
                                <td className="py-4 px-6 font-medium text-white">{acc.name}</td>
                                <td className="py-4 px-6 text-gray-300">
                                    <span className={`px-2 py-1 rounded text-xs border ${acc.type === 'Asset' ? 'border-neon-green text-neon-green' :
                                            acc.type === 'Liability' ? 'border-neon-pink text-neon-pink' :
                                                acc.type === 'Equity' ? 'border-neon-purple text-neon-purple' :
                                                    'border-yellow-500 text-yellow-500'
                                        }`}>{acc.type}</span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(acc)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-neon-cyan transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(acc.code)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-neon-pink transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <h2 className="text-2xl font-bold text-white mb-6">{editingAccount ? 'Edit Akun' : 'Tambah Akun Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Kode Akun</label>
                                <input
                                    type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                    disabled={!!editingAccount}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nama Akun</label>
                                <input
                                    type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default COA;
