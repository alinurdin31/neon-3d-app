import React, { useState, useMemo } from 'react';
import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../context/DataContext';

const BukuBesar = () => {
    const { journal, accounts } = useData();
    const [selectedAccountCode, setSelectedAccountCode] = useState(accounts[0]?.code || '');

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Get selected account details
    const selectedAccount = accounts.find(a => a.code === selectedAccountCode);

    // Filter and process ledger entries
    const ledgerEntries = useMemo(() => {
        if (!selectedAccountCode) return [];

        const filtered = journal.flatMap(entry => {
            const lines = entry.lines.filter(line => line.code === selectedAccountCode);
            return lines.map(line => ({
                id: entry.id,
                date: entry.date,
                desc: entry.desc,
                ref: entry.ref,
                debit: Number(line.debit),
                credit: Number(line.credit)
            }));
        });

        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate Running Balance
        let balance = 0;
        const isNormalDebit = ['Asset', 'Expense'].includes(selectedAccount?.type);

        return filtered.map(entry => {
            if (isNormalDebit) {
                balance += (entry.debit - entry.credit);
            } else {
                balance += (entry.credit - entry.debit);
            }
            return { ...entry, balance };
        });
    }, [journal, selectedAccountCode, selectedAccount]);

    const totalDebit = ledgerEntries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = ledgerEntries.reduce((sum, e) => sum + e.credit, 0);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Buku Besar</h1>
                    <p className="text-gray-400">Detail transaksi per akun (Ledger)</p>
                </div>
                <div className="w-72">
                    <label className="block text-xs text-gray-500 mb-1 uppercase">Pilih Akun</label>
                    <select
                        value={selectedAccountCode}
                        onChange={(e) => setSelectedAccountCode(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-cyan"
                    >
                        {accounts.map(acc => (
                            <option key={acc.code} value={acc.code} className="text-black">
                                {acc.code} - {acc.name} ({acc.type})
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Account Summary Card */}
            {selectedAccount && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 border-t-4 border-neon-cyan relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-gray-400 font-medium mb-1">Saldo Akhir</h3>
                            <p className="text-3xl font-bold text-white">
                                {formatRupiah(ledgerEntries.length > 0 ? ledgerEntries[ledgerEntries.length - 1].balance : 0)}
                            </p>
                            <p className="text-xs text-neon-cyan mt-1 font-mono">{selectedAccount.code} - {selectedAccount.name}</p>
                        </div>
                        <BookOpen className="absolute right-4 bottom-4 w-16 h-16 text-neon-cyan/10" />
                    </div>
                    <div className="glass-card p-6 border-t-4 border-neon-green">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-neon-green" />
                            <h3 className="text-gray-400 font-medium">Total Debit</h3>
                        </div>
                        <p className="text-2xl font-bold text-white">{formatRupiah(totalDebit)}</p>
                    </div>
                    <div className="glass-card p-6 border-t-4 border-neon-pink">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-4 h-4 text-neon-pink" />
                            <h3 className="text-gray-400 font-medium">Total Kredit</h3>
                        </div>
                        <p className="text-2xl font-bold text-white">{formatRupiah(totalCredit)}</p>
                    </div>
                </div>
            )}

            {/* Ledger Table */}
            <div className="glass-card p-0 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="py-3 px-6">Tanggal</th>
                                <th className="py-3 px-6">Ref & ID</th>
                                <th className="py-3 px-6">Keterangan</th>
                                <th className="py-3 px-6 text-right text-neon-green">Debit</th>
                                <th className="py-3 px-6 text-right text-neon-pink">Kredit</th>
                                <th className="py-3 px-6 text-right">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {ledgerEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-500">
                                        Belum ada transaksi pada akun ini.
                                    </td>
                                </tr>
                            ) : (
                                ledgerEntries.map((entry, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-3 px-6 text-gray-300">{entry.date}</td>
                                        <td className="py-3 px-6">
                                            <div className="font-mono text-xs text-white group-hover:text-neon-cyan transition-colors">{entry.ref}</div>
                                            <div className="text-[10px] text-gray-500">{entry.id}</div>
                                        </td>
                                        <td className="py-3 px-6 text-white">{entry.desc}</td>
                                        <td className="py-3 px-6 text-right font-mono text-neon-green/90">
                                            {entry.debit > 0 ? formatRupiah(entry.debit) : '-'}
                                        </td>
                                        <td className="py-3 px-6 text-right font-mono text-neon-pink/90">
                                            {entry.credit > 0 ? formatRupiah(entry.credit) : '-'}
                                        </td>
                                        <td className="py-3 px-6 text-right font-bold text-white font-mono bg-white/5">
                                            {formatRupiah(entry.balance)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BukuBesar;
