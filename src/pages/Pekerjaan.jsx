import React, { useState } from 'react';
import { Plus, Edit, Trash2, Briefcase, Calendar, CheckCircle, Clock, User, DollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';

const Pekerjaan = () => {
    const { jobs, addJob, updateJob, deleteJob, customers, employees, addJournalEntry, setTransactions } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', customerId: '', employeeId: '',
        status: 'Pending', deadline: '', desc: '',
        cost: 0 // Biaya Jasa/Upah
    });

    const openModal = (job = null) => {
        if (job) {
            setEditingId(job.id);
            setFormData(job);
        } else {
            setEditingId(null);
            setFormData({ title: '', customerId: '', employeeId: '', status: 'Pending', deadline: '', desc: '', cost: 0 });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const customerName = customers.find(c => c.id == formData.customerId)?.name || 'Umum';
        const employeeName = employees.find(e => e.id == formData.employeeId)?.name || 'Unassigned';

        const payload = {
            ...formData,
            customerName,
            employeeName,
            cost: Number(formData.cost)
        };

        if (editingId) {
            updateJob(editingId, payload);
        } else {
            addJob(payload);
        }
        setIsModalOpen(false);
    };

    const handleComplete = (job) => {
        if (!window.confirm(`Selesaikan pekerjaan "${job.title}" dan bayar upah Rp ${job.cost.toLocaleString()} ke ${job.employeeName}?`)) return;

        // 1. Update Job Status
        updateJob(job.id, { ...job, status: 'Selesai' });

        // 2. Create Transaction (Payroll Expense)
        const txId = `JPAY-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];

        setTransactions(prev => [{
            id: txId,
            date,
            type: 'Pengeluaran',
            category: 'Upah Pekerjaan',
            desc: `Upah Pekerjaan: ${job.title} (${job.employeeName})`,
            total: job.cost,
            paymentMethod: 'Cash'
        }, ...prev]);

        // 3. Accounting Journal (Dr Beban Gaji, Cr Kas)
        addJournalEntry({
            date,
            desc: `Upah Penyelesaian Job #${job.id}`,
            ref: txId,
            lines: [
                { code: '6101', debit: job.cost, credit: 0 }, // Beban Gaji & Upah
                { code: '1101', debit: 0, credit: job.cost }  // Kas Tunai
            ]
        });

        alert('Pekerjaan selesai & transaksi upah tercatat!');
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus pekerjaan ini?')) deleteJob(id);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Selesai': return 'text-neon-green border-neon-green bg-neon-green/10';
            case 'Proses': return 'text-neon-cyan border-neon-cyan bg-neon-cyan/10';
            default: return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
        }
    };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Catatan Pekerjaan (Job Order)</h1>
                    <p className="text-gray-400">Tracking proyek & Integrasi Upah Karyawan</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-medium">
                    <Plus className="w-5 h-5" />
                    Buat Job Baru
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div key={job.id} className="glass-card p-6 flex flex-col h-full relative group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-neon-purple font-mono text-xs">{job.id}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(job.status)}`}>
                                {job.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.desc}</p>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <User className="w-4 h-4 text-neon-pink" />
                                <span>{job.employeeName || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span>Upah: {formatRupiah(job.cost)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Calendar className="w-4 h-4 text-neon-cyan" />
                                <span>Deadline: {job.deadline}</span>
                            </div>
                        </div>

                        <div className="mt-auto border-t border-white/10 pt-4 flex justify-between items-center">
                            {job.status !== 'Selesai' ? (
                                <button
                                    onClick={() => handleComplete(job)}
                                    className="flex items-center gap-2 px-3 py-2 bg-neon-green/20 text-neon-green rounded hover:bg-neon-green/30 transition-colors text-sm font-bold"
                                >
                                    <CheckCircle className="w-4 h-4" /> Selesaikan
                                </button>
                            ) : (
                                <span className="text-gray-500 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Upah Terbayar</span>
                            )}

                            <div className="flex gap-2">
                                <button onClick={() => openModal(job)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Pekerjaan' : 'Buat Job Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Nama Pekerjaan</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" placeholder="Contoh: Service Neon Box A" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Pelanggan</label>
                                    <select required value={formData.customerId} onChange={e => setFormData({ ...formData, customerId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan">
                                        <option value="">Pilih Pelanggan</option>
                                        {customers.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Teknisi / Karyawan</label>
                                    <select required value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan">
                                        <option value="">Pilih Teknisi</option>
                                        {employees.map(e => <option key={e.id} value={e.id} className="text-black">{e.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Upah / Komisi (Rp)</label>
                                    <input type="number" required value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Deadline</label>
                                    <input type="date" required value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Deskripsi</label>
                                <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" rows="3"></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                                <button type="submit" className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400">Simpan Job</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pekerjaan;
