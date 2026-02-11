import React, { forwardRef } from 'react';
import { useData } from '../../context/DataContext';

export const StrukBelanja = forwardRef(({ transaction }, ref) => {
    const { settings } = useData();
    if (!transaction) return null;

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <div ref={ref} className="p-4 bg-white text-black font-mono text-xs w-[300px] mx-auto">
            {/* Header */}
            <div className="text-center mb-4 border-b border-dashed border-black pb-2">
                <h1 className="font-bold text-lg uppercase">{settings.name}</h1>
                <p>{settings.address}</p>
                <p>{settings.phone}</p>
            </div>

            {/* Info */}
            <div className="mb-4">
                <div className="flex justify-between"><span>No:</span><span>{transaction.id}</span></div>
                <div className="flex justify-between"><span>Tgl:</span><span>{transaction.date}</span></div>
                <div className="flex justify-between"><span>Kasir:</span><span>Admin</span></div>
                <div className="flex justify-between"><span>Pelanggan:</span><span>{transaction.customerName || 'Umum'}</span></div>
            </div>

            {/* Items */}
            <div className="border-b border-dashed border-black pb-2 mb-2">
                {transaction.items.map((item, idx) => (
                    <div key={idx} className="mb-1">
                        <div className="font-bold">{item.name}</div>
                        <div className="flex justify-between">
                            <span>{item.quantity} x {formatRupiah(item.price)}</span>
                            <span>{formatRupiah(item.quantity * item.price)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 mb-4">
                <div className="flex justify-between"><span>Subtotal:</span><span>{formatRupiah(transaction.subtotal)}</span></div>
                {transaction.discount > 0 && (
                    <div className="flex justify-between"><span>Diskon:</span><span>- {formatRupiah(transaction.discount)}</span></div>
                )}
                {transaction.shipping > 0 && (
                    <div className="flex justify-between"><span>Ongkir:</span><span>+ {formatRupiah(transaction.shipping)}</span></div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-dashed border-black pt-1 mt-1">
                    <span>TOTAL:</span><span>{formatRupiah(transaction.total)}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                    <span>Metode:</span><span className="font-bold uppercase">{transaction.paymentMethod}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] mt-4 pt-2 border-t border-dashed border-black">
                <p>Terima Kasih atas Kunjungan Anda</p>
                <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
            </div>
        </div>
    );
});
