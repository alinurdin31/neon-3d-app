import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useData } from '../context/DataContext';

const Pelanggan = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

    const openModal = (cust = null) => {
        if (cust) {
            setEditingId(cust.id);
            setFormData(cust);
        } else {
            setEditingId(null);
            setFormData({ name: '', phone: '', address: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateCustomer(editingId, formData);
        } else {
            addCustomer(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus pelanggan ini?')) {
            deleteCustomer(id);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Manajemen Pelanggan</h1>
                    <p className="text-gray-400">Database pelanggan untuk faktur dan pengiriman</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-medium">
                    <Plus className="w-5 h-5" />
                    Tambah Pelanggan
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((cust) => (
                    <div key={cust.id} className="glass-card p-6 relative group hover:border-neon-cyan/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-gray-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(cust)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-neon-cyan transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(cust.id)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-neon-pink transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{cust.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{cust.phone}</p>

                        <div className="pt-4 border-t border-white/10">
                            <p className="text-sm text-gray-300 line-clamp-2">{cust.address}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nama Lengkap / Perusahaan</label>
                                <input
                                    type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nomor Telepon</label>
                                <input
                                    type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Alamat Lengkap</label>
                                <textarea
                                    required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                    rows="3"
                                />
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

export default Pelanggan;
