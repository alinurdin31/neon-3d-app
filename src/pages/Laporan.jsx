import React from 'react';
import { useData } from '../context/DataContext';

const Laporan = () => {
    const { transactions, journal } = useData();
    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Calculate totals from Journal
    // Revenue = Credit on 401
    // Expense = Debit on 5xx, 6xx

    let revenue = 0;
    let expenses = 0;

    journal.forEach(entry => {
        entry.lines.forEach(line => {
            if (line.code.startsWith('4')) { // Revenue
                revenue += line.credit;
            }
            if (line.code.startsWith('5') || line.code.startsWith('6')) { // Expenses
                expenses += line.debit;
            }
        });
    });

    const profit = revenue - expenses;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold neon-text text-white mb-2">Laporan Keuangan</h1>
                <p className="text-gray-400">Ringkasan Laba & Rugi Real-time</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-t-4 border-neon-green">
                    <h3 className="text-gray-400 font-medium mb-1">Total Pendapatan</h3>
                    <p className="text-3xl font-bold text-white">{formatRupiah(revenue)}</p>
                </div>
                <div className="glass-card p-6 border-t-4 border-neon-pink">
                    <h3 className="text-gray-400 font-medium mb-1">Total Pengeluaran</h3>
                    <p className="text-3xl font-bold text-white">{formatRupiah(expenses)}</p>
                </div>
                <div className="glass-card p-6 border-t-4 border-neon-cyan relative overflow-hidden">
                    <div className="absolute inset-0 bg-neon-cyan/5"></div>
                    <h3 className="text-gray-400 font-medium mb-1 relative z-10">Laba Bersih</h3>
                    <p className="text-3xl font-bold text-white relative z-10">{formatRupiah(profit)}</p>
                </div>
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-6">Detail Transaksi Keuangan</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 uppercase text-sm">
                                <th className="py-3 px-2">Tanggal</th>
                                <th className="py-3 px-2">Keterangan</th>
                                <th className="py-3 px-2 text-right">Debit (Masuk)</th>
                                <th className="py-3 px-2 text-right">Kredit (Keluar)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {journal.slice(0, 10).map((entry, idx) => {
                                const debitTotal = entry.lines.reduce((sum, l) => sum + l.debit, 0);
                                const creditTotal = entry.lines.reduce((sum, l) => sum + l.credit, 0);
                                return (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-2 text-gray-300">{entry.date}</td>
                                        <td className="py-3 px-2 text-white font-medium">
                                            {entry.desc} <span className="text-neon-purple text-xs ml-2">#{entry.id}</span>
                                        </td>
                                        <td className="py-3 px-2 text-right text-neon-green font-mono">{formatRupiah(debitTotal)}</td>
                                        <td className="py-3 px-2 text-right text-neon-pink font-mono">{formatRupiah(creditTotal)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Laporan;
