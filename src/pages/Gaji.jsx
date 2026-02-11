import React, { useState } from 'react';
import { User, Printer, Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Gaji = () => {
    const { employees, paySalary, addEmployee, updateEmployee, deleteEmployee } = useData();
    const [processingId, setProcessingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: '', salary: 0, phone: '', joinDate: '' });

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Columns
    const columns = [
        { header: 'Nama Karyawan', accessor: 'name', render: (e) => <div className="font-bold text-white flex items-center gap-2"><User className="w-4 h-4 text-neon-purple" /> {e.name}</div> },
        { header: 'Jabatan', accessor: 'role' },
        { header: 'Gaji Pokok', accessor: 'salary', render: (e) => <span className="text-gray-400">{formatRupiah(e.salary)}</span> },
        { header: 'Telepon', accessor: 'phone' },
        {
            header: 'Status',
            accessor: 'status',
            render: (e) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${e.status === 'Dibayar' ? 'bg-neon-green/20 text-neon-green' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {e.status}
                </span>
            )
        },
        {
            header: 'Aksi',
            render: (emp) => (
                <div className="flex items-center justify-end gap-2">
                    {emp.status === 'Dibayar' ? (
                        <button
                            title="Cetak Slip"
                            onClick={() => handlePrint(emp.id)}
                            className="p-2 hover:bg-white/10 rounded text-neon-cyan transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            title="Bayar Gaji"
                            onClick={() => handlePay(emp.id)}
                            disabled={processingId === emp.id}
                            className={`p-2 rounded transition-colors ${processingId === emp.id ? 'text-gray-500' : 'text-neon-green hover:bg-neon-green/10'}`}
                        >
                            <DollarSign className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        title="Edit"
                        onClick={() => openModal(emp)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        title="Hapus"
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Actions
    const openModal = (emp = null) => {
        if (emp) {
            setEditingId(emp.id);
            setFormData(emp);
        } else {
            setEditingId(null);
            setFormData({ name: '', role: '', salary: 0, phone: '', joinDate: new Date().toISOString().split('T')[0] });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...formData, salary: Number(formData.salary) };
        if (editingId) {
            updateEmployee(editingId, payload);
        } else {
            addEmployee({ ...payload, status: 'Menunggu' });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus karyawan ini? Data yang terhapus tidak bisa dikembalikan.')) {
            deleteEmployee(id);
        }
    };

    const handlePay = (id) => {
        if (window.confirm('Proses pembayaran gaji untuk karyawan ini?')) {
            setProcessingId(id);
            setTimeout(() => {
                paySalary(id);
                setProcessingId(null);
            }, 1000);
        }
    };

    const handlePrint = (id) => {
        window.open(`/print/slip-gaji/${id}`, '_blank', 'width=800,height=600');
    };

    return (
        <div className="space-y-6">
            <DataTable
                title="Karyawan & Gaji"
                columns={columns}
                data={employees}
                onAdd={() => openModal()}
                searchPlaceholder="Cari karyawan..."
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Karyawan' : 'Tambah Karyawan'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Nama Lengkap</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Jabatan</label>
                            <input type="text" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">No. Telepon</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Gaji Pokok</label>
                        <input type="number" required value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
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

export default Gaji;
