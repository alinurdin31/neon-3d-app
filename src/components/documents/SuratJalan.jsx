import React, { forwardRef } from 'react';
import { useData } from '../../context/DataContext';

export const SuratJalan = forwardRef(({ transaction }, ref) => {
    const { settings } = useData();
    if (!transaction) return null;

    return (
        <div ref={ref} className="p-12 bg-white text-black font-sans max-w-4xl mx-auto min-h-[800px]">
            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-6">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-wider">{settings.name}</h2>
                    <p className="text-gray-600">{settings.address}</p>
                    <p className="text-gray-600">{settings.phone}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-bold border-2 border-black px-4 py-1 inline-block mb-2">SURAT JALAN</h1>
                    <p className="font-bold">No: SJ-{transaction.id}</p>
                    <p className="text-gray-500">Tanggal: {transaction.date}</p>
                </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-xs uppercase font-bold text-gray-500 mb-1">Penerima:</h3>
                    <div className="border border-black p-4 min-h-[100px]">
                        <p className="font-bold text-lg">{transaction.customerName || 'Pelanggan Umum'}</p>
                        <p>{transaction.customerAddress}</p>
                        <p className="mt-2 text-sm text-gray-600">{transaction.customerPhone}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs uppercase font-bold text-gray-500 mb-1">Ekspedisi / Pengirim:</h3>
                    <div className="border border-black p-4 min-h-[100px]">
                        <p className="font-bold">Kurir Internal</p>
                        <p>Jenis Layanan: Reguler</p>
                        <p>Catatan: -</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-12 border border-black">
                <thead className="bg-gray-100 border-b border-black">
                    <tr>
                        <th className="py-3 px-4 text-center font-bold border-r border-black w-16">No</th>
                        <th className="py-3 px-4 text-left font-bold border-r border-black">Nama Barang / Deskripsi</th>
                        <th className="py-3 px-4 text-center font-bold border-r border-black w-32">Kuantitas</th>
                        <th className="py-3 px-4 text-center font-bold w-32">Satuan</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black">
                    {transaction.items.map((item, idx) => (
                        <tr key={idx}>
                            <td className="py-3 px-4 text-center border-r border-black">{idx + 1}</td>
                            <td className="py-3 px-4 font-medium border-r border-black">{item.name}</td>
                            <td className="py-3 px-4 text-center border-r border-black font-bold text-lg">{item.quantity}</td>
                            <td className="py-3 px-4 text-center">Pcs</td> // Default unit
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Signatures */}
            <div className="flex justify-between mt-24 px-12 text-center">
                <div>
                    <p className="mb-20">Penerima</p>
                    <div className="border-t border-black w-40 mx-auto"></div>
                    <p className="text-xs mt-1">(Tanda Tangan & Nama Terang)</p>
                </div>
                <div>
                    <p className="mb-20">Hormat Kami,</p>
                    <div className="border-t border-black w-40 mx-auto"></div>
                    <p className="text-xs mt-1 font-bold">{settings.name}</p>
                </div>
            </div>
        </div>
    );
});
