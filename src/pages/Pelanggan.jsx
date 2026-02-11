import React, { useState } from 'react';
import { Plus, Edit, Trash2, History, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Pelanggan = () => {
    const { customers, transactions, addCustomer, updateCustomer, deleteCustomer } = useData();

    // UI States
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Filter transactions for history
    const customerTransactions = selectedCustomer
        ? transactions.filter(t => t.customerId === selectedCustomer.id)
        : [];

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Columns
    const columns = [
        { header: 'Nama Pelanggan', accessor: 'name', render: (c) => <div className="font-bold text-white">{c.name}</div> },
        { header: 'Telepon', accessor: 'phone' },
        { header: 'Alamat', accessor: 'address', render: (c) => <span className="text-gray-400 text-sm truncate max-w-xs block">{c.address}</span> },
        {
            header: 'Aksi',
            render: (cust) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        title="Riwayat Transaksi"
                        onClick={() => openHistory(cust)}
                        className="p-2 hover:bg-white/10 rounded text-neon-blue transition-colors"
                    >
                        <History className="w-4 h-4" />
                    </button>
                    <button
                        title="Edit"
                        onClick={() => openFormModal(cust)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        title="Hapus"
                        onClick={() => handleDelete(cust.id)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Actions
    const openFormModal = (cust = null) => {
        if (cust) {
            setEditingId(cust.id);
            setFormData(cust);
        } else {
            setEditingId(null);
            setFormData({ name: '', phone: '', address: '' });
        }
        setIsFormModalOpen(true);
    };

    const openHistory = (cust) => {
        setSelectedCustomer(cust);
        setIsHistoryModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateCustomer(editingId, formData);
        } else {
            addCustomer(formData);
        }
        setIsFormModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus pelanggan ini beserta data terkait?')) {
            deleteCustomer(id);
        }
    };

    return (
        <div className="space-y-6">
            <DataTable
                title="Manajemen Pelanggan"
                columns={columns}
                data={customers}
                onAdd={() => openFormModal()}
                searchPlaceholder="Cari nama pelanggan..."
            />

            {/* Form Modal */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={editingId ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Nama Lengkap / Perusahaan</label>
                        <input
                            type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            placeholder="Contoh: PT. Maju Jaya"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Nomor Telepon</label>
                        <input
                            type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            placeholder="Contoh: 0812..."
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Alamat Lengkap</label>
                        <textarea
                            required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            rows="3"
                            placeholder="Alamat lengkap untuk pengiriman..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400">Simpan</button>
                    </div>
                </form>
            </Modal>

            {/* History Modal */}
            <Modal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                title={`Riwayat Transaksi: ${selectedCustomer?.name || ''}`}
            >
                <div className="space-y-4">
                    {customerTransactions.length > 0 ? (
                        customerTransactions.map(tx => (
                            <div key={tx.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center group hover:bg-white/10 transition-colors">
                                <div>
                                    <h4 className="text-white font-bold flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-neon-purple" />
                                        {tx.id}
                                    </h4>
                                    <p className="text-gray-400 text-xs">{tx.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-neon-cyan font-bold">{formatRupiah(tx.total)}</p>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{tx.paymentMethod}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <History className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>Belum ada riwayat transaksi.</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Pelanggan;
