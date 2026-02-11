import React, { useState } from 'react';
import { BookOpen, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

const BukuBesar = () => {
    const { journal, accounts } = useData();
    const [selectedAccount, setSelectedAccount] = useState('101'); // Default to Cash

    // Flatten journal lines to ledger entries for selection
    const ledgerEntries = journal.flatMap(entry =>
        entry.lines
            .filter(line => line.code === selectedAccount)
            .map(line => ({
                id: entry.id,
                date: entry.date,
                desc: entry.desc,
                ref: entry.ref,
                debit: line.debit,
                credit: line.credit
            }))
    );

    // Calculate runinng balance
    let runningBalance = 0;
    const entriesWithBalance = ledgerEntries.map(entry => {
        // Asset/Expense: Debit increases, Credit decreases
        // Liability/Equity/Revenue: Credit increases, Debit decreases
        // Simplified for demo: Just Debt - Credit
        runningBalance += (entry.debit - entry.credit);
        return { ...entry, balance: runningBalance };
    });

    const totalDebit = entriesWithBalance.reduce((acc, e) => acc + e.debit, 0);
    const totalCredit = entriesWithBalance.reduce((acc, e) => acc + e.credit, 0);

    return (
        <div className="h-full flex flex-col space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Buku Besar</h1>
                    <p className="text-gray-400">Filter berdasarkan Akun (COA)</p>
                </div>
            </header>

            <div className="glass-card flex-1 overflow-hidden flex flex-col p-0">
                <div className="p-4 border-b border-white/10 flex gap-4 overflow-x-auto custom-scrollbar">
                    {accounts.map(acc => (
                        <button
                            key={acc.code}
                            onClick={() => setSelectedAccount(acc.code)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedAccount === acc.code
                                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                                    : 'hover:bg-white/5 text-gray-400 border border-transparent'
                                }`}
                        >
                            {acc.code} - {acc.name}
                        </button>
                    ))}
                </div>

                <div className="overflow-auto flex-1 p-6">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/10">
                                <th className="pb-3 pl-4 font-medium w-32">Tanggal</th>
                                <th className="pb-3 font-medium w-32">ID Jurnal</th>
                                <th className="pb-3 font-medium">Deskripsi</th>
                                <th className="pb-3 font-medium w-32">Ref</th>
                                <th className="pb-3 font-medium text-right w-40">Debit</th>
                                <th className="pb-3 font-medium text-right w-40">Kredit</th>
                                <th className="pb-3 pr-4 font-medium text-right w-40">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {entriesWithBalance.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-8 text-gray-500">Tidak ada transaksi untuk akun ini.</td></tr>
                            ) : (
                                entriesWithBalance.map((entry, idx) => (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-3 pl-4 text-gray-300">{entry.date}</td>
                                        <td className="py-3 text-neon-purple font-mono text-sm">{entry.id}</td>
                                        <td className="py-3 text-white font-medium">{entry.desc}</td>
                                        <td className="py-3 text-gray-400 text-sm">{entry.ref}</td>
                                        <td className="py-3 text-right text-neon-green font-mono">
                                            {entry.debit > 0 ? formatRupiah(entry.debit) : '-'}
                                        </td>
                                        <td className="py-3 text-right text-neon-pink font-mono">
                                            {entry.credit > 0 ? formatRupiah(entry.credit) : '-'}
                                        </td>
                                        <td className="py-3 pr-4 text-right font-bold text-white font-mono">
                                            {formatRupiah(entry.balance)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between items-center text-sm">
                    <span className="text-gray-400">Total Transaksi: {entriesWithBalance.length}</span>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider">Total Debit</span>
                            <span className="text-neon-green font-bold text-lg">{formatRupiah(totalDebit)}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider">Total Kredit</span>
                            <span className="text-neon-pink font-bold text-lg">{formatRupiah(totalCredit)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BukuBesar;
