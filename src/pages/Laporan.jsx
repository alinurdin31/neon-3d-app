import React, { useState, useMemo } from 'react';
import { PieChart, BarChart, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';

const Laporan = () => {
    const { journal, accounts } = useData();
    const [activeTab, setActiveTab] = useState('labarugi'); // 'labarugi' or 'neraca'

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    // Calculate details per account
    const accountBalances = useMemo(() => {
        const balances = {};

        // Initialize with 0
        accounts.forEach(acc => {
            balances[acc.code] = { ...acc, balance: 0 };
        });

        // Sum journal entries
        journal.forEach(entry => {
            entry.lines.forEach(line => {
                if (balances[line.code]) {
                    if (['Asset', 'Expense'].includes(balances[line.code].type)) {
                        balances[line.code].balance += (line.debit - line.credit);
                    } else {
                        balances[line.code].balance += (line.credit - line.debit);
                    }
                }
            });
        });

        return balances;
    }, [journal, accounts]);

    // Financial Statements Data
    const financialData = useMemo(() => {
        const data = {
            revenue: { accounts: [], total: 0 },
            expense: { accounts: [], total: 0 },
            asset: { accounts: [], total: 0 },
            liability: { accounts: [], total: 0 },
            equity: { accounts: [], total: 0 },
            netIncome: 0
        };

        Object.values(accountBalances).forEach(acc => {
            if (acc.type === 'Revenue') {
                data.revenue.accounts.push(acc);
                data.revenue.total += acc.balance;
            } else if (acc.type === 'Expense') {
                data.expense.accounts.push(acc);
                data.expense.total += acc.balance;
            } else if (acc.type === 'Asset') {
                data.asset.accounts.push(acc);
                data.asset.total += acc.balance;
            } else if (acc.type === 'Liability') {
                data.liability.accounts.push(acc);
                data.liability.total += acc.balance;
            } else if (acc.type === 'Equity') {
                data.equity.accounts.push(acc);
                data.equity.total += acc.balance;
            }
        });

        data.netIncome = data.revenue.total - data.expense.total;

        // Add Net Income to Equity (Retained Earnings)
        data.equity.total += data.netIncome;

        return data;
    }, [accountBalances]);

    const ReportRow = ({ label, value, isHeader = false, isTotal = false, indent = false }) => (
        <div className={`flex justify-between py-2 ${isHeader ? 'border-b border-white/20 font-bold text-white mt-4' : 'border-b border-white/5'} ${isTotal ? 'font-bold text-white border-t border-white/20 bg-white/5 px-2 mt-1' : 'text-gray-400'} ${indent ? 'pl-6' : ''}`}>
            <span>{label}</span>
            <span>{formatRupiah(value)}</span>
        </div>
    );

    return (
        <div className="space-y-6 h-full flex flex-col">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Laporan Keuangan</h1>
                    <p className="text-gray-400">Analisis kinerja bisnis dan posisi keuangan</p>
                </div>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => setActiveTab('labarugi')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'labarugi' ? 'bg-neon-cyan text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <TrendingUp className="w-4 h-4" /> Laba Rugi
                    </button>
                    <button
                        onClick={() => setActiveTab('neraca')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'neraca' ? 'bg-neon-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <FileText className="w-4 h-4" /> Neraca (Balance Sheet)
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-auto custom-scrollbar">
                {activeTab === 'labarugi' ? (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 border-t-4 border-neon-green">
                                <h3 className="text-gray-400 font-medium mb-1">Total Pendapatan</h3>
                                <p className="text-2xl font-bold text-white">{formatRupiah(financialData.revenue.total)}</p>
                            </div>
                            <div className="glass-card p-6 border-t-4 border-neon-pink">
                                <h3 className="text-gray-400 font-medium mb-1">Total Beban</h3>
                                <p className="text-2xl font-bold text-white">{formatRupiah(financialData.expense.total)}</p>
                            </div>
                            <div className="glass-card p-6 border-t-4 border-neon-cyan relative overflow-hidden">
                                <div className="absolute inset-0 bg-neon-cyan/5"></div>
                                <h3 className="text-gray-400 font-medium mb-1 relative z-10">Laba Bersih (Net Income)</h3>
                                <p className={`text-2xl font-bold relative z-10 ${financialData.netIncome >= 0 ? 'text-neon-cyan' : 'text-red-500'}`}>{formatRupiah(financialData.netIncome)}</p>
                            </div>
                        </div>

                        {/* Detailed Report */}
                        <div className="glass-card p-8">
                            <h2 className="text-center text-xl font-bold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4">Laporan Laba Rugi</h2>

                            <ReportRow label="PENDAPATAN (REVENUE)" isHeader />
                            {financialData.revenue.accounts.map(acc => (
                                <ReportRow key={acc.code} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                            ))}
                            <ReportRow label="Total Pendapatan" value={financialData.revenue.total} isTotal />

                            <ReportRow label="BEBAN & PENGELUARAN (EXPENSES)" isHeader />
                            {financialData.expense.accounts.map(acc => (
                                <ReportRow key={acc.code} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                            ))}
                            <ReportRow label="Total Beban" value={financialData.expense.total} isTotal />

                            <div className="mt-8 pt-4 border-t-2 border-white/20 flex justify-between items-center bg-neon-cyan/10 p-4 rounded-lg">
                                <span className="text-lg font-bold text-white uppercase">Laba Bersih (Net Income)</span>
                                <span className={`text-2xl font-bold ${financialData.netIncome >= 0 ? 'text-neon-cyan' : 'text-red-500'}`}>{formatRupiah(financialData.netIncome)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Balance Check */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="glass-card p-6 border-t-4 border-neon-blue">
                                <h3 className="text-gray-400 font-medium mb-1">Total Aset</h3>
                                <p className="text-2xl font-bold text-white">{formatRupiah(financialData.asset.total)}</p>
                            </div>
                            <div className="glass-card p-6 border-t-4 border-neon-purple">
                                <h3 className="text-gray-400 font-medium mb-1">Total Kewajiban & Ekuitas</h3>
                                <p className="text-2xl font-bold text-white">{formatRupiah(financialData.liability.total + financialData.equity.total)}</p>
                            </div>
                        </div>

                        <div className="glass-card p-8">
                            <h2 className="text-center text-xl font-bold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4">Neraca (Balance Sheet)</h2>

                            <ReportRow label="ASET (ASSETS)" isHeader />
                            {financialData.asset.accounts.map(acc => (
                                <ReportRow key={acc.code} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                            ))}
                            <ReportRow label="Total Aset" value={financialData.asset.total} isTotal />

                            <ReportRow label="KEWAJIBAN (LIABILITIES)" isHeader />
                            {financialData.liability.accounts.map(acc => (
                                <ReportRow key={acc.code} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                            ))}
                            <ReportRow label="Total Kewajiban" value={financialData.liability.total} isTotal />

                            <ReportRow label="EKUITAS (EQUITY)" isHeader />
                            {financialData.equity.accounts.map(acc => (
                                <ReportRow key={acc.code} label={`${acc.code} - ${acc.name}`} value={acc.balance} indent />
                            ))}
                            <ReportRow label="Laba Bersih Tahun Berjalan" value={financialData.netIncome} indent />
                            <ReportRow label="Total Ekuitas" value={financialData.equity.total} isTotal />

                            <div className="mt-8 pt-4 border-t-2 border-white/20 flex justify-between items-center">
                                <div className="text-gray-400 font-medium uppercase">Total Kewajiban + Ekuitas</div>
                                <div className="text-xl font-bold text-white">{formatRupiah(financialData.liability.total + financialData.equity.total)}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Laporan;
