import React, { forwardRef } from 'react';
import { useData } from '../../context/DataContext';

export const SlipGaji = forwardRef(({ transaction }, ref) => {
    const { settings } = useData();
    const { employees } = useData();

    if (!transaction) return null;

    // Find employee data if available in transaction description or linked ID
    // For now simple parsing or passing employee object would be better, but we use transaction info

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    return (
        <div ref={ref} className="p-8 bg-white text-black font-sans w-[800px] mx-auto border border-gray-300">
            <div className="text-center border-b-2 border-double border-gray-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase">{settings.name}</h1>
                <p className="text-gray-600">{settings.address}</p>
                <h2 className="text-xl font-bold mt-4 underline">SLIP GAJI KARYAWAN</h2>
                <p className="text-sm">Periode: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-600">ID Transaksi</span>
                        <span className="font-mono">{transaction.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-600">Tanggal Bayar</span>
                        <span>{transaction.date}</span>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                        <span className="text-gray-600">Keterangan</span>
                        <span className="font-bold">{transaction.desc}</span>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="font-bold bg-gray-100 p-2 mb-2 border border-gray-300">PENERIMAAN</h3>
                <div className="flex justify-between items-center p-2">
                    <span>Gaji Pokok / Total Gaji</span>
                    <span className="font-bold text-lg">{formatRupiah(transaction.total)}</span>
                </div>
                {/* Placeholder for allowances if added later */}
            </div>

            <div className="flex justify-between items-center bg-gray-800 text-white p-4 rounded mb-12">
                <span className="font-bold text-lg">TOTAL DITERIMA</span>
                <span className="font-bold text-2xl">{formatRupiah(transaction.total)}</span>
            </div>

            <div className="flex justify-between px-12 text-center">
                <div>
                    <p className="mb-16">Penerima</p>
                    <div className="border-t border-black w-32 mx-auto"></div>
                </div>
                <div>
                    <p className="mb-16">Mengetahui,</p>
                    <div className="border-t border-black w-32 mx-auto"></div>
                    <p className="text-sm mt-1">{settings.name}</p>
                </div>
            </div>
        </div>
    );
});
