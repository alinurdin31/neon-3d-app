import React, { useState } from 'react';
import { Plus, Save, Trash2, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Jurnal = () => {
    const { addJournalEntry, journal, accounts } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [desc, setDesc] = useState('');
    const [refId, setRefId] = useState('');
    const [lines, setLines] = useState([
        { id: 1, account: '', debit: 0, credit: 0 },
        { id: 2, account: '', debit: 0, credit: 0 },
    ]);

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Columns
    const columns = [
        { header: 'Tanggal', accessor: 'date', render: (j) => <span className="text-gray-400">{j.date}</span> },
        { header: 'Keterangan', accessor: 'desc', render: (j) => <div className="font-medium text-white">{j.desc}</div> },
        { header: 'Ref', accessor: 'ref', render: (j) => <span className="font-mono text-neon-purple text-xs">{j.ref}</span> },
        {
            header: 'Detail Akun',
            render: (j) => (
                <div className="space-y-1 text-sm">
                    {j.lines.map((line, idx) => (
                        <div key={idx} className="flex justify-between gap-4 border-b border-white/5 pb-1 last:border-0">
                            <span className="text-gray-400 font-mono text-xs">{line.code}</span>
                            <div className="flex gap-4">
                                {line.debit > 0 && <span className="text-neon-cyan/80 w-24 text-right">{formatRupiah(line.debit)} (Dr)</span>}
                                {line.credit > 0 && <span className="text-neon-pink/80 w-24 text-right">{formatRupiah(line.credit)} (Cr)</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    ];

    // Form logic
    const addLine = () => {
        setLines([...lines, { id: Date.now(), account: '', debit: 0, credit: 0 }]);
    };

    const removeLine = (id) => {
        if (lines.length > 2) {
            setLines(lines.filter(l => l.id !== id));
        }
    };

    const updateLine = (id, field, value) => {
        setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const totalDebit = lines.reduce((sum, l) => sum + Number(l.debit), 0);
        const totalCredit = lines.reduce((sum, l) => sum + Number(l.credit), 0);

        if (totalDebit !== totalCredit || totalDebit === 0) {
            alert('Jurnal tidak seimbang atau bernilai nol!');
            return;
        }

        const validLines = lines.filter(l => l.account && (Number(l.debit) > 0 || Number(l.credit) > 0));
        if (validLines.length < 2) {
            alert('Minimal harus ada 2 baris akun yang valid!');
            return;
        }

        addJournalEntry({
            date: new Date().toISOString().split('T')[0],
            desc: desc || 'Entri Manual',
            ref: refId || `JV-${Date.now()}`,
            lines: validLines.map(l => ({
                code: l.account,
                debit: Number(l.debit),
                credit: Number(l.credit)
            }))
        });

        // Reset
        setDesc('');
        setRefId('');
        setLines([{ id: Date.now(), account: '', debit: 0, credit: 0 }, { id: Date.now() + 1, account: '', debit: 0, credit: 0 }]);
        setIsModalOpen(false);
    };

    const openModal = () => {
        setLines([{ id: Date.now(), account: '', debit: 0, credit: 0 }, { id: Date.now() + 1, account: '', debit: 0, credit: 0 }]);
        setDesc('');
        setRefId('');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <DataTable
                title="Jurnal Umum"
                columns={columns}
                data={journal}
                onAdd={openModal}
                searchPlaceholder="Cari jurnal..."
            />

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Posting Jurnal Manual"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Deskripsi</label>
                            <input value={desc} onChange={e => setDesc(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all" placeholder="Contoh: Koreksi Saldo" />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Referensi (Opsional)</label>
                            <input value={refId} onChange={e => setRefId(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all" placeholder="Nomor Bukti" />
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 uppercase font-bold text-center mb-2">
                            <div className="col-span-1">#</div>
                            <div className="col-span-5 text-left">Akun</div>
                            <div className="col-span-3">Debit</div>
                            <div className="col-span-3">Kredit</div>
                        </div>

                        {lines.map((line, idx) => (
                            <div key={line.id} className="grid grid-cols-12 gap-2 items-center">
                                <span className="col-span-1 text-center text-gray-500">{idx + 1}</span>
                                <div className="col-span-5">
                                    <select
                                        value={line.account}
                                        onChange={e => updateLine(line.id, 'account', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan"
                                    >
                                        <option value="" className="text-black">Pilih Akun</option>
                                        {accounts.map(acc => (
                                            <option key={acc.code} value={acc.code} className="text-black">{acc.code} - {acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <input type="number" value={line.debit} onChange={e => updateLine(line.id, 'debit', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-right text-sm focus:outline-none focus:border-neon-green" />
                                </div>
                                <div className="col-span-3 flex gap-1">
                                    <input type="number" value={line.credit} onChange={e => updateLine(line.id, 'credit', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white text-right text-sm focus:outline-none focus:border-neon-pink" />
                                    <button onClick={() => removeLine(line.id)} className="text-gray-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={addLine} className="w-full py-2 border border-dashed border-white/20 rounded-lg text-gray-400 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Tambah Baris
                    </button>

                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">Total</div>
                        <div className="flex gap-8 font-bold font-mono">
                            <div className="text-neon-green">Dr: {formatRupiah(lines.reduce((s, l) => s + Number(l.debit), 0))}</div>
                            <div className="text-neon-pink">Cr: {formatRupiah(lines.reduce((s, l) => s + Number(l.credit), 0))}</div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400 shadow-lg hover:shadow-neon-cyan/20">Posting Jurnal</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Jurnal;
