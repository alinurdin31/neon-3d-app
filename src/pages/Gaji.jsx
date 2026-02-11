import React, { useState } from 'react';
import { User, DollarSign, Calendar, Printer, Plus, Edit, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';

const Gaji = () => {
    const { employees, paySalary, addEmployee, updateEmployee, deleteEmployee } = useData();
    const [processingId, setProcessingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: '', salary: 0, phone: '', joinDate: '' });

    // --- CRUD Handlers ---
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

    // --- Payroll Handlers ---
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

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Karyawan & Gaji</h1>
                    <p className="text-gray-400">Database karyawan dan manajemen payroll bulanan</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-medium">
                    <Plus className="w-5 h-5" />
                    Tambah Karyawan
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((emp) => (
                    <div key={emp.id} className="glass-card p-6 relative overflow-hidden group hover:border-neon-purple/50 transition-colors flex flex-col">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(emp)} className="p-1.5 bg-black/50 hover:bg-white text-gray-400 hover:text-black rounded"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(emp.id)} className="p-1.5 bg-black/50 hover:bg-red-500 text-gray-400 hover:text-white rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-gray-400 shadow-inner">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{emp.name}</h3>
                                <p className="text-neon-purple text-sm font-medium">{emp.role}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-1 bg-black/20 p-4 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Gaji Pokok</span>
                                <span className="text-white font-mono">{formatRupiah(emp.salary)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Telepon</span>
                                <span className="text-white">{emp.phone || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status Gaji</span>
                                <span className={`font-bold ${emp.status === 'Dibayar' ? 'text-neon-green' : 'text-yellow-500'}`}>{emp.status}</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            {emp.status === 'Dibayar' ? (
                                <button
                                    onClick={() => handlePrint(emp.id)}
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/20"
                                >
                                    <Printer className="w-4 h-4" /> Cetak Slip Gaji
                                </button>
                            ) : (
                                <button
                                    onClick={() => handlePay(emp.id)}
                                    disabled={processingId === emp.id}
                                    className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-pink hover:opacity-90 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(188,19,254,0.3)] transition-all disabled:opacity-50"
                                >
                                    {processingId === emp.id ? 'Memproses...' : 'Bayar Gaji Sekarang'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Karyawan' : 'Tambah Karyawan'}</h2>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gaji;
