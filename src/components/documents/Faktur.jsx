import React, { forwardRef } from 'react';
import { useData } from '../../context/DataContext';

export const Faktur = forwardRef(({ transaction }, ref) => {
    const { settings } = useData();
    if (!transaction) return null;

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    return (
        <div ref={ref} className="p-12 bg-white text-black font-sans max-w-4xl mx-auto min-h-[1000px]">
            {/* Header */}
            <div className="flex justify-between items-start mb-12 border-b-4 border-gray-800 pb-8">
                <div>
                    {/* Logo Logic */}
                    <div className="mb-4">
                        {settings.logoOp === 1 && <h1 className="text-4xl font-bold tracking-tighter">NEON <span className="text-blue-600">3D</span></h1>}
                        {settings.logoOp === 2 && <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full mb-2"></div>}
                    </div>

                    <h2 className="text-xl font-bold uppercase">{settings.name}</h2>
                    <p className="text-gray-600 max-w-xs">{settings.address}</p>
                    <p className="text-gray-600">{settings.phone}</p>
                    <p className="text-gray-600">{settings.email}</p>
                </div>
                <div className="text-right">
                    <h1 className="text-5xl font-bold text-gray-200 mb-2">INVOICE</h1>
                    <p className="text-xl font-bold text-gray-800">#{transaction.id}</p>
                    <p className="text-gray-500">Tanggal: {transaction.date}</p>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-12">
                <h3 className="text-gray-500 uppercase text-sm font-bold mb-2">Ditagihkan Kepada:</h3>
                <h2 className="text-2xl font-bold">{transaction.customerName || 'Pelanggan Umum'}</h2>
                <p className="text-gray-600 max-w-md">{transaction.customerAddress || '-'}</p>
            </div>

            {/* Table */}
            <table className="w-full mb-12">
                <thead className="bg-gray-100 border-b-2 border-gray-800">
                    <tr>
                        <th className="py-3 px-4 text-left font-bold text-gray-700">Deskripsi Item</th>
                        <th className="py-3 px-4 text-center font-bold text-gray-700">Qty</th>
                        <th className="py-3 px-4 text-right font-bold text-gray-700">Harga Satuan</th>
                        <th className="py-3 px-4 text-right font-bold text-gray-700">Jumlah</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {transaction.items.map((item, idx) => (
                        <tr key={idx}>
                            <td className="py-4 px-4 font-medium">{item.name}</td>
                            <td className="py-4 px-4 text-center">{item.quantity}</td>
                            <td className="py-4 px-4 text-right">{formatRupiah(item.price)}</td>
                            <td className="py-4 px-4 text-right font-bold">{formatRupiah(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-80 space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatRupiah(transaction.subtotal)}</span>
                    </div>
                    {transaction.discount > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Diskon</span>
                            <span className="text-red-500">- {formatRupiah(transaction.discount)}</span>
                        </div>
                    )}
                    {transaction.shipping > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Pengiriman</span>
                            <span>{formatRupiah(transaction.shipping)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-4 border-t-2 border-gray-800">
                        <span>Total</span>
                        <span>{formatRupiah(transaction.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm mt-auto pt-12 border-t border-gray-200">
                <p>Pembayaran via {transaction.paymentMethod}. Terima kasih atas kepercayaan Anda.</p>
                <p className="mt-2 font-mono text-xs">{settings.phone} | {settings.email}</p>
            </div>
        </div>
    );
});
