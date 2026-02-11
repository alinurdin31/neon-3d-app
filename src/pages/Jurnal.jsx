import React, { useState } from 'react';
import { Plus, Save, Trash2, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';

const Jurnal = () => {
    const { addJournalEntry, journal, accounts } = useData();
    const [lines, setLines] = useState([
        { id: 1, account: '', debit: 0, credit: 0 },
        { id: 2, account: '', debit: 0, credit: 0 },
    ]);
    const [desc, setDesc] = useState('');
    const [refId, setRefId] = useState('');

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

    const handleSave = () => {
        const totalDebit = lines.reduce((sum, l) => sum + Number(l.debit), 0);
        const totalCredit = lines.reduce((sum, l) => sum + Number(l.credit), 0);

        if (totalDebit !== totalCredit) {
            alert('Debit dan Kredit harus seimbang!');
            return;
        }

        addJournalEntry({
            date: new Date().toISOString().split('T')[0],
            desc: desc || 'Entri Manual',
            ref: refId || '-',
            lines: lines.map(l => ({
                code: l.account,
                debit: Number(l.debit),
                credit: Number(l.credit)
            }))
        });

        // Reset
        setDesc('');
        setRefId('');
        setLines([{ id: Date.now(), account: '', debit: 0, credit: 0 }, { id: Date.now() + 1, account: '', debit: 0, credit: 0 }]);
        alert('Jurnal berhasil disimpan!');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Jurnal Umum</h1>
                    <p className="text-gray-400">Catat entri akuntansi manual ke Buku Besar Global</p>
                </div>
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-bold">
                    <Save className="w-5 h-5" />
                    Posting Jurnal
                </button>
            </header>

            <div className="glass-card p-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Deskripsi</label>
                        <input value={desc} onChange={e => setDesc(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Referensi</label>
                        <input value={refId} onChange={e => setRefId(e.target.value)} type="text" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-all" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 pb-2 border-b border-white/10 text-gray-400 text-sm font-medium uppercase tracking-wider">
                        <div className="col-span-6">Akun</div>
                        <div className="col-span-2 text-right">Debit</div>
                        <div className="col-span-2 text-right">Kredit</div>
                    </div>

                    {lines.map((line) => (
                        <div key={line.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6">
                                <select
                                    value={line.account}
                                    onChange={e => updateLine(line.id, 'account', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                                >
                                    <option value="" className="text-black">Pilih Akun</option>
                                    {accounts.map(acc => (
                                        <option key={acc.code} value={acc.code} className="text-black">{acc.code} - {acc.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <input type="number" value={line.debit} onChange={e => updateLine(line.id, 'debit', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-right focus:outline-none focus:border-neon-cyan" />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <input type="number" value={line.credit} onChange={e => updateLine(line.id, 'credit', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-right focus:outline-none focus:border-neon-cyan" />
                                <button onClick={() => removeLine(line.id)} className="text-gray-600 hover:text-neon-pink transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={addLine} className="mt-6 flex items-center gap-2 text-neon-cyan hover:text-white transition-colors font-medium">
                    <Plus className="w-4 h-4" /> Add Line
                </button>
            </div>
        </div>
    );
};

export default Jurnal;
