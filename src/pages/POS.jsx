import React, { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer, FileText, Truck, X, Edit, User, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';

const POS = () => {
    const { products, customers, processSale } = useData();
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastTxId, setLastTxId] = useState(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Checkout State
    const [checkoutData, setCheckoutData] = useState({
        customerId: '',
        discount: 0,
        shipping: 0,
        paymentMethod: 'Cash',
        cashGiven: 0
    });

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product) => {
        setCart(current => {
            const existing = current.find(item => item.id === product.id);
            if (existing) {
                return current.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...current, { ...product, quantity: 1, originalPrice: product.price }]; // Store original price
        });
    };

    const updateQuantity = (id, change) => {
        setCart(current => current.map(item => {
            if (item.id === id) {
                const product = products.find(p => p.id === id);
                const newQuantity = item.quantity + change;
                return { ...item, quantity: Math.max(0, newQuantity) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const updateItemPrice = (id, newPrice) => {
        setCart(current => current.map(item =>
            item.id === id ? { ...item, price: parseFloat(newPrice) } : item
        ));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal - Number(checkoutData.discount) + Number(checkoutData.shipping);
    const change = Number(checkoutData.cashGiven) - total;

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const txId = processSale(cart, {
            method: checkoutData.paymentMethod,
            customerId: checkoutData.customerId || 1, // Default to General Customer
            discount: Number(checkoutData.discount),
            shipping: Number(checkoutData.shipping),
            subtotal: subtotal,
            total: total,
        });

        setLastTxId(txId);
        setCart([]);
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
    };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);

    const openPrintWindow = (type) => {
        if (!lastTxId) return;
        window.open(`/print/${type}/${lastTxId}`, '_blank', 'width=800,height=600');
    };

    return (
        <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-8rem)] gap-6 relative">
            {/* Product Grid Section */}
            <div className="flex-1 flex flex-col glass-card p-6 h-[500px] md:h-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold neon-text text-white">Kasir (POS)</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-neon-cyan w-64"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredProducts.map(product => (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => addToCart(product)}
                            className={`bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer transition-all group hover:bg-white/10 hover:border-neon-cyan/50`}
                        >
                            <h3 className="font-bold text-white mb-1 truncate">{product.name}</h3>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">{product.category}</span>
                                <span className={`${product.stock <= 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-500' : 'text-neon-green'}`}>Stok: {product.stock}</span>
                            </div>
                            <p className="text-neon-cyan font-bold">{formatRupiah(product.price)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-full md:w-[400px] glass-card p-6 flex flex-col h-[500px] md:h-auto">
                <h2 className="text-2xl font-bold neon-text text-white mb-6 flex items-center gap-2">
                    <ShoppingCart className="text-neon-pink" />
                    Detail Pesanan
                </h2>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                            <p>Keranjang kosong</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="bg-black/20 rounded-lg p-3 relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-white max-w-[70%] truncate">{item.name}</h4>
                                    <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-500 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 bg-white/5 rounded px-2">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-white p-1"><Minus className="w-3 h-3" /></button>
                                        <span className="font-bold text-white text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-white p-1"><Plus className="w-3 h-3" /></button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Rp</span>
                                        <input
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => updateItemPrice(item.id, e.target.value)}
                                            className="w-20 bg-transparent text-right text-neon-cyan font-bold focus:outline-none border-b border-transparent focus:border-neon-cyan"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-between mb-2 text-gray-400">
                        <span>Subtotal</span>
                        <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <button
                        onClick={() => setShowCheckoutModal(true)}
                        disabled={cart.length === 0}
                        className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-pink rounded-xl font-bold text-white mt-4 shadow-lg hover:shadow-neon-purple/50 transition-all disabled:opacity-50"
                    >
                        Lanjut Pembayaran
                    </button>
                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {showCheckoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <button onClick={() => setShowCheckoutModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
                            <h2 className="text-2xl font-bold text-white mb-6">Proses Pembayaran</h2>

                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Pelanggan</label>
                                        <select
                                            value={checkoutData.customerId}
                                            onChange={e => setCheckoutData({ ...checkoutData, customerId: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                        >
                                            <option value="">Pilih Pelanggan</option>
                                            {customers.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Metode Pembayaran</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Cash', 'QRIS', 'Bank'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: m })}
                                                    className={`py-2 rounded-lg border text-sm font-bold transition-all ${checkoutData.paymentMethod === m ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' : 'border-white/10 text-gray-400'}`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Uang Diterima (Cash)</label>
                                        <input
                                            type="number"
                                            value={checkoutData.cashGiven}
                                            onChange={e => setCheckoutData({ ...checkoutData, cashGiven: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Diskon (Nominal)</label>
                                        <input
                                            type="number"
                                            value={checkoutData.discount}
                                            onChange={e => setCheckoutData({ ...checkoutData, discount: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Biaya Kirim</label>
                                        <input
                                            type="number"
                                            value={checkoutData.shipping}
                                            onChange={e => setCheckoutData({ ...checkoutData, shipping: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-white/10 mt-4">
                                        <div className="flex justify-between text-gray-400 mb-1"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
                                        <div className="flex justify-between text-red-400 mb-1"><span>Diskon</span><span>- {formatRupiah(checkoutData.discount)}</span></div>
                                        <div className="flex justify-between text-green-400 mb-1"><span>Ongkir</span><span>+ {formatRupiah(checkoutData.shipping)}</span></div>
                                        <div className="flex justify-between text-white font-bold text-xl mt-4"><span>Total Tagihan</span><span className="text-neon-cyan">{formatRupiah(total)}</span></div>
                                        <div className="flex justify-between text-gray-400 mt-2 text-sm"><span>Kembali</span><span>{formatRupiah(change > 0 ? change : 0)}</span></div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-4 bg-gradient-to-r from-neon-green to-emerald-600 rounded-xl font-bold text-white shadow-lg hover:shadow-neon-green/30"
                            >
                                Konfirmasi Pembayaran
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success/Print Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                    >
                        <div className="bg-[#1a1a2e] border border-neon-cyan p-8 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.3)] max-w-md w-full text-center relative">
                            <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X /></button>
                            <div className="w-20 h-20 rounded-full bg-neon-green/20 text-neon-green flex items-center justify-center mx-auto mb-6">
                                <Truck className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Transaksi Sukses!</h2>
                            <div className="grid grid-cols-1 gap-3 mt-6">
                                <button onClick={() => openPrintWindow('struk')} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white">
                                    <Printer className="w-5 h-5" /> Cetak Struk Belanja
                                </button>
                                <button onClick={() => openPrintWindow('faktur')} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white">
                                    <FileText className="w-5 h-5" /> Cetak Faktur (Invoice)
                                </button>
                                <button onClick={() => openPrintWindow('surat-jalan')} className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white">
                                    <Truck className="w-5 h-5" /> Cetak Surat Jalan
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default POS;
