import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Search, Archive } from 'lucide-react';
import { useData } from '../context/DataContext';

const Produk = () => {
    const { products, addProduct, updateProduct, deleteProduct, restockProduct } = useData();
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

    // State for Product Form
    const [productForm, setProductForm] = useState({ name: '', category: '', price: 0, cost: 0, stock: 0 });
    const [editingId, setEditingId] = useState(null);

    // State for Restock Form
    const [restockForm, setRestockForm] = useState({ id: null, name: '', qty: 0, cost: 0, method: '1-1100' });

    const filteredProducts = products; // simplified, can add search state later if needed

    // --- Product CRUD ---
    const openProductModal = (prod = null) => {
        if (prod) {
            setEditingId(prod.id);
            setProductForm(prod);
        } else {
            setEditingId(null);
            setProductForm({ name: '', category: '', price: 0, cost: 0, stock: 0 });
        }
        setIsProductModalOpen(true);
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...productForm,
            price: Number(productForm.price),
            cost: Number(productForm.cost),
            stock: Number(productForm.stock),
            status: Number(productForm.stock) > 0 ? 'Aktif' : 'Habis'
        };

        if (editingId) {
            updateProduct(editingId, payload);
        } else {
            addProduct(payload);
        }
        setIsProductModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus produk ini?')) deleteProduct(id);
    };

    // --- Restock Logic ---
    const openRestockModal = (prod) => {
        setRestockForm({ id: prod.id, name: prod.name, qty: 1, cost: prod.cost, method: '1-1100' });
        setIsRestockModalOpen(true);
    };

    const handleRestockSubmit = (e) => {
        e.preventDefault();
        const totalCost = restockForm.qty * restockForm.cost;
        restockProduct(
            { id: restockForm.id, name: restockForm.name },
            restockForm.qty,
            restockForm.cost,
            totalCost,
            restockForm.method === '1-1100' ? 'Cash' : 'Bank' // mapping back to simple string for helper if needed, but DataContext uses code now for journal
        );
        setIsRestockModalOpen(false);
    };

    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-2">Manajemen Produk</h1>
                    <p className="text-gray-400">Database Inventaris & Restock</p>
                </div>
                <button onClick={() => openProductModal()} className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all font-medium">
                    <Plus className="w-5 h-5" />
                    Tambah Produk Baru
                </button>
            </header>

            <div className="glass-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 uppercase text-sm">
                                <th className="py-4 px-6">Nama Produk</th>
                                <th className="py-4 px-6">Kategori</th>
                                <th className="py-4 px-6 text-right">Harga Jual</th>
                                <th className="py-4 px-6 text-right">HPP (Cost)</th>
                                <th className="py-4 px-6 text-center">Stok</th>
                                <th className="py-4 px-6 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.map((prod) => (
                                <tr key={prod.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-6 font-medium text-white">
                                        {prod.name}
                                        <div className="text-xs text-gray-500">ID: {prod.id}</div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-400">{prod.category}</td>
                                    <td className="py-4 px-6 text-right text-neon-cyan font-bold">{formatRupiah(prod.price)}</td>
                                    <td className="py-4 px-6 text-right text-gray-500">{formatRupiah(prod.cost)}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${prod.stock < 10 ? 'text-yellow-500 border border-yellow-500' : 'text-neon-green border border-neon-green'}`}>
                                            {prod.stock} Unit
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button title="Restock" onClick={() => openRestockModal(prod)} className="p-2 hover:bg-white/10 rounded text-neon-green transition-colors">
                                                <Archive className="w-4 h-4" />
                                            </button>
                                            <button title="Edit" onClick={() => openProductModal(prod)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button title="Hapus" onClick={() => handleDelete(prod.id)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {
                isProductModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#1a1a2e] border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
                            <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Nama Produk</label>
                                    <input type="text" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Kategori</label>
                                        <input type="text" required value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Stok Awal</label>
                                        <input type="number" required value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Harga Jual (Price)</label>
                                        <input type="number" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Harga Beli/Pokok (HPP)</label>
                                        <input type="number" required value={productForm.cost} onChange={e => setProductForm({ ...productForm, cost: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan" />
                                    </div>
                                </div>
                                {!editingId && (
                                    <p className="text-xs text-yellow-500 mt-2">* Stok awal pada 'Tambah Produk' tidak mencatat jurnal pembelian. Gunakan fitur 'Restock' untuk pembelian barang selanjutnya.</p>
                                )}
                                <div className="flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                                    <button type="submit" className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Restock Modal */}
            {
                isRestockModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#1a1a2e] border border-neon-green p-8 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(34,197,94,0.2)] relative">
                            <button onClick={() => setIsRestockModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <Archive className="text-neon-green" /> Restock Produk
                            </h2>
                            <p className="text-gray-400 mb-6 font-mono text-sm">Produk: {restockForm.name}</p>

                            <form onSubmit={handleRestockSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Jumlah Beli (Qty)</label>
                                    <input type="number" required min="1" value={restockForm.qty} onChange={e => setRestockForm({ ...restockForm, qty: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Harga Beli Satuan (Update Cost)</label>
                                    <input type="number" required min="1" value={restockForm.cost} onChange={e => setRestockForm({ ...restockForm, cost: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Sumber Dana Pembelian</label>
                                    <select
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green"
                                        value={restockForm.method} onChange={e => setRestockForm({ ...restockForm, method: e.target.value })}
                                    >
                                        <option value="1-1100">Kas Tunai (1-1100)</option>
                                        <option value="1-1110">Bank BCA (1-1110)</option>
                                    </select>
                                </div>

                                <div className="bg-white/5 p-4 rounded-lg mt-4">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Total Pembelian</span>
                                        <span className="text-white font-bold">{formatRupiah(restockForm.qty * restockForm.cost)}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 text-center">Akan tercatat: Dr Persediaan, Cr Kas/Bank</p>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsRestockModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                                    <button type="submit" className="px-6 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400">Konfirmasi Restock</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Produk;
