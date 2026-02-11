import React from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle } from 'lucide-react';

const Impor = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="text-center">
                <h1 className="text-3xl font-bold neon-text text-white mb-2">Impor Data</h1>
                <p className="text-gray-400">Unggah produk, transaksi, atau data pelanggan secara massal</p>
            </header>

            <div className="glass-card p-12 border-2 border-dashed border-white/20 hover:border-neon-cyan/50 transition-colors flex flex-col items-center justify-center gap-6 group cursor-pointer bg-white/[0.02]">
                <div className="w-24 h-24 rounded-full bg-white/5 group-hover:bg-neon-cyan/10 flex items-center justify-center transition-colors relative">
                    <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-neon-cyan transition-colors" />
                    <div className="absolute inset-0 bg-neon-cyan/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Seret & Lepas file Anda di sini</h3>
                    <p className="text-gray-400 mb-6">Format yang didukung: .CSV, .XLSX, .JSON</p>
                    <button className="px-8 py-3 bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform group-hover:scale-105">
                        Jelajahi File
                    </button>
                </div>
            </div>

            <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-white mb-6">Impor Terbaru</h3>
                <div className="space-y-4">
                    {[
                        { file: 'produk_feb_2024.csv', size: '2.4 MB', date: 'Baru saja', status: 'Memproses', color: 'text-neon-purple' },
                        { file: 'arsip_penjualan_2023.xlsx', size: '15.8 MB', date: '2 jam yang lalu', status: 'Selesai', color: 'text-neon-green' },
                        { file: 'daftar_pelanggan_v2.json', size: '1.1 MB', date: 'Kemarin', status: 'Gagal', color: 'text-neon-pink' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <FileSpreadsheet className="w-6 h-6 text-gray-300" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-white">{item.file}</h4>
                                <p className="text-xs text-gray-500">{item.size} • {item.date}</p>
                            </div>
                            <div className={`flex items-center gap-2 font-medium ${item.color}`}>
                                {item.status === 'Selesai' && <CheckCircle className="w-4 h-4" />}
                                {item.status === 'Gagal' && <AlertTriangle className="w-4 h-4" />}
                                {item.status === 'Memproses' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                                {item.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Impor;
