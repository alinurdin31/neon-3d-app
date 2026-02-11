import React, { useState } from 'react';
import { FileText, Printer, Eye, Truck, User, Calendar, DollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Riwayat = () => {
    const { transactions, getSaleDetails } = useData();
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    const handleViewDetails = async (sale) => {
        setLoadingDetails(true);
        setIsModalOpen(true);
        try {
            const details = await getSaleDetails(sale.id);
            setSelectedSale(details);
        } catch (error) {
            console.error("Error fetching sale details:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handlePrint = (type, txId) => {
        window.open(`/print/${type}/${txId}`, '_blank', 'width=800,height=600');
    };

    const columns = [
        {
            header: 'ID Transaksi',
            accessor: 'id',
            render: (s) => <span className="text-neon-cyan font-mono font-bold">#TRX-{s.id}</span>
        },
        {
            header: 'Tanggal',
            accessor: 'created_at',
            render: (s) => (
                <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
            )
        },
        {
            header: 'Pelanggan',
            accessor: 'customer_name',
            render: (s) => (
                <div className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4 text-neon-purple" />
                    {s.customer_name}
                </div>
            )
        },
        {
            header: 'Total',
            accessor: 'total',
            render: (s) => <span className="font-bold text-white">{formatRupiah(s.total)}</span>
        },
        {
            header: 'Metode',
            accessor: 'payment_method',
            render: (s) => (
                <span className="px-2 py-1 rounded bg-white/5 text-xs font-bold text-gray-400">
                    {s.payment_method}
                </span>
            )
        },
        {
            header: 'Aksi',
            render: (s) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleViewDetails(s)}
                        className="p-2 hover:bg-white/10 rounded-lg text-neon-cyan transition-all"
                        title="Lihat Detail"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handlePrint('struk', s.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-neon-green transition-all"
                        title="Cetak Struk"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <DataTable
                title="Riwayat Penjualan"
                columns={columns}
                data={transactions.sort((a, b) => b.id - a.id)}
                searchPlaceholder="Cari transaksi atau pelanggan..."
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Detail Transaksi"
            >
                {loadingDetails ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-10 h-10 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : selectedSale ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">ID Transaksi</p>
                                <p className="text-white font-mono text-lg">#TRX-{selectedSale.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tanggal</p>
                                <p className="text-white">{new Date(selectedSale.created_at).toLocaleString('id-ID')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Pelanggan</p>
                                <p className="text-white">{selectedSale.customer_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Metode Bayar</p>
                                <p className="text-neon-cyan font-bold">{selectedSale.payment_method}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Daftar Item
                            </h4>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedSale.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                                        <div>
                                            <p className="text-white font-bold">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} x {formatRupiah(item.price)}</p>
                                        </div>
                                        <p className="text-white font-bold">{formatRupiah(item.quantity * item.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center text-xl font-bold">
                                <span className="text-white">TOTAL</span>
                                <span className="text-neon-cyan">{formatRupiah(selectedSale.total)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-8">
                            <button onClick={() => handlePrint('struk', selectedSale.id)} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-all">
                                <Printer className="w-4 h-4" /> Struk
                            </button>
                            <button onClick={() => handlePrint('faktur', selectedSale.id)} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-all">
                                <FileText className="w-4 h-4" /> Faktur
                            </button>
                            <button onClick={() => handlePrint('surat-jalan', selectedSale.id)} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-all">
                                <Truck className="w-4 h-4" /> S. Jalan
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">Gagal memuat detail transaksi.</p>
                )}
            </Modal>
        </div>
    );
};

export default Riwayat;
