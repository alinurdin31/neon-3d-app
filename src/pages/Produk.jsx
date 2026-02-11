import React, { useState } from 'react';
import { Archive, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { supabase } from '../lib/supabase';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Produk = () => {
    const { products, addProduct, updateProduct, deleteProduct, restockProduct } = useData();

    // Modal States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

    // Forms
    const [productForm, setProductForm] = useState({ name: '', category: '', price: 0, cost: 0, stock: 0, imageUrl: '' });
    const [editingId, setEditingId] = useState(null);
    const [restockForm, setRestockForm] = useState({ id: null, name: '', qty: 1, cost: 0, method: '1101' });

    // Formatters
    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    // Columns Configuration
    const columns = [
        {
            header: 'Produk',
            accessor: 'name',
            render: (prod) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {prod.imageUrl ? (
                            <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-5 h-5 text-gray-600" />
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-white">{prod.name}</div>
                        <div className="text-xs text-gray-500">ID: {prod.id}</div>
                    </div>
                </div>
            )
        },
        { header: 'Kategori', accessor: 'category' },
        {
            header: 'Harga Jual',
            accessor: 'price',
            render: (prod) => <span className="text-neon-cyan font-bold">{formatRupiah(prod.price)}</span>
        },
        {
            header: 'HPP (Cost)',
            accessor: 'cost',
            render: (prod) => <span className="text-gray-400">{formatRupiah(prod.cost)}</span>
        },
        {
            header: 'Stok',
            accessor: 'stock',
            render: (prod) => (
                <span className={`px-2 py-1 rounded text-xs font-bold ${prod.stock < 10 ? 'text-yellow-500 border border-yellow-500' : 'text-neon-green border border-neon-green'}`}>
                    {prod.stock} Unit
                </span>
            )
        },
        {
            header: 'Aksi',
            render: (prod) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        title="Restock"
                        onClick={() => openRestockModal(prod)}
                        className="p-2 hover:bg-white/10 rounded text-neon-green transition-colors"
                    >
                        <Archive className="w-4 h-4" />
                    </button>
                    <button
                        title="Edit"
                        onClick={() => openProductModal(prod)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        title="Hapus"
                        onClick={() => handleDelete(prod.id)}
                        className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Handlers
    const openProductModal = (prod = null) => {
        if (prod) {
            setEditingId(prod.id);
            setProductForm({ ...prod });
        } else {
            setEditingId(null);
            setProductForm({ name: '', category: '', price: 0, cost: 0, stock: 0, imageUrl: '' });
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

    const openRestockModal = (prod) => {
        // Use current HPP as default restock cost
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
            restockForm.method === '1-1100' ? 'Cash' : restockForm.method === '1-1110' ? 'Bank' : 'Cash'
        );
        setIsRestockModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <DataTable
                title="Manajemen Produk"
                columns={columns}
                data={products}
                onAdd={() => openProductModal()}
                searchPlaceholder="Cari nama atau kategori..."
            />

            {/* Product Modal */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                title={editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
            >
                <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Nama Produk</label>
                        <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Kategori</label>
                            <input
                                type="text"
                                required
                                value={productForm.category}
                                onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Stok Awal</label>
                            <input
                                type="number"
                                required
                                value={productForm.stock}
                                onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Harga Jual</label>
                            <input
                                type="number"
                                required
                                value={productForm.price}
                                onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">HPP (Cost)</label>
                            <input
                                type="number"
                                required
                                value={productForm.cost}
                                onChange={e => setProductForm({ ...productForm, cost: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan"
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <label className="block text-gray-400 text-[10px] uppercase font-bold mb-3 tracking-wider">Foto Produk</label>
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                                {productForm.imageUrl ? (
                                    <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-gray-700" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    type="file"
                                    id="prod-image-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const fileExt = file.name.split('.').pop();
                                        const fileName = `prod_${Date.now()}.${fileExt}`;
                                        const filePath = `products/${fileName}`;

                                        const { error } = await supabase.storage.from('media').upload(filePath, file);
                                        if (error) {
                                            alert('Gagal upload foto: ' + (error.message || error.error));
                                            return;
                                        }

                                        const { data: publicData } = supabase.storage.from('media').getPublicUrl(filePath);
                                        setProductForm({ ...productForm, imageUrl: publicData.publicUrl });
                                    }}
                                />
                                <label
                                    htmlFor="prod-image-upload"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/10 cursor-pointer transition-all"
                                >
                                    Pilih Gambar
                                </label>
                                <p className="text-[10px] text-gray-500">Format: JPG, PNG, WEBP. Maks 2MB.</p>
                            </div>
                        </div>
                    </div>

                    {!editingId && (
                        <p className="text-xs text-yellow-500 mt-2">* Stok awal pada 'Tambah Produk' tidak mencatat jurnal pembelian. Gunakan fitur 'Restock' untuk pembelian barang selanjutnya.</p>
                    )}
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Batal</button>
                        <button type="submit" className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-cyan-400">Simpan</button>
                    </div>
                </form>
            </Modal>

            {/* Restock Modal */}
            <Modal
                isOpen={isRestockModalOpen}
                onClose={() => setIsRestockModalOpen(false)}
                title="Restock Produk"
            >
                <form onSubmit={handleRestockSubmit} className="space-y-4">
                    <p className="text-gray-400 font-mono text-sm border-b border-white/10 pb-4">Product: <span className="text-white font-bold">{restockForm.name}</span></p>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Jumlah Beli (Qty)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={restockForm.qty}
                            onChange={e => setRestockForm({ ...restockForm, qty: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Harga Beli Satuan (Update Cost)</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={restockForm.cost}
                            onChange={e => setRestockForm({ ...restockForm, cost: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Sumber Dana Pembelian</label>
                        <select
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green"
                            value={restockForm.method}
                            onChange={e => setRestockForm({ ...restockForm, method: e.target.value })}
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
                        <button type="submit" className="px-6 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-green-400">Konfirmasi</button>
                    </div>
                </form>
            </Modal>
        </div >
    );
};

export default Produk;
