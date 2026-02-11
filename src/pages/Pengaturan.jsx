import React, { useState } from 'react';
import { Save, Store, MapPin, Phone, Mail, Image, Settings } from 'lucide-react';
import { useData } from '../context/DataContext';

const Pengaturan = () => {
    const { settings, updateSettings } = useData();
    const [formData, setFormData] = useState(settings);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        updateSettings(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                <div className="p-3 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20">
                    <Settings className="w-8 h-8 text-neon-cyan" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold neon-text text-white mb-1">Pengaturan Toko</h1>
                    <p className="text-gray-400">Konfigurasi identitas toko untuk dokumen dan struk</p>
                </div>
            </header>

            <div className="glass-card p-8 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                <Store className="w-4 h-4 text-neon-cyan" /> Nama Toko
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all placeholder-gray-600"
                                placeholder="Masukkan nama toko..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-neon-cyan" /> Alamat Lengkap
                            </label>
                            <textarea
                                name="address" value={formData.address} onChange={handleChange} rows="3"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all placeholder-gray-600"
                                placeholder="Alamat lengkap toko..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-neon-cyan" /> Telepon
                                </label>
                                <input
                                    type="text" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-all placeholder-gray-600"
                                    placeholder="08..."
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-neon-cyan" /> Email
                                </label>
                                <input
                                    type="text" name="email" value={formData.email} onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-all placeholder-gray-600"
                                    placeholder="email@toko.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                            <Image className="w-4 h-4 text-neon-cyan" /> Logo Toko (Pilih Style Struk)
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(op => (
                                <button
                                    key={op}
                                    onClick={() => setFormData({ ...formData, logoOp: op })}
                                    className={`relative border-2 rounded-xl p-4 flex flex-col items-center justify-center aspect-square transition-all group ${formData.logoOp === op
                                            ? 'border-neon-purple bg-neon-purple/10 shadow-[0_0_15px_rgba(188,19,254,0.3)]'
                                            : 'border-white/10 hover:bg-white/5 hover:border-white/30'
                                        }`}
                                >
                                    {op === 1 && <div className="text-3xl font-bold font-neon text-neon-cyan group-hover:scale-110 transition-transform">N3D</div>}
                                    {op === 2 && <div className="w-10 h-10 bg-gradient-to-tr from-neon-pink to-neon-purple rounded-full group-hover:scale-110 transition-transform"></div>}
                                    {op === 3 && <Store className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />}

                                    <span className={`text-[10px] mt-2 uppercase font-bold ${formData.logoOp === op ? 'text-neon-purple' : 'text-gray-500'}`}>
                                        Style {op}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-xs text-gray-400">
                            <p>Info: Perubahan logo dan identitas akan langsung diterapkan pada semua dokumen cetak (Struk Penjualan, Slip Gaji, Laporan).</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-95 ${saved
                                ? 'bg-green-500 shadow-green-500/30 ring-2 ring-green-400'
                                : 'bg-gradient-to-r from-neon-cyan to-blue-500 shadow-neon-cyan/30 hover:brightness-110'
                            }`}
                    >
                        <Save className={`w-5 h-5 ${saved ? 'animate-bounce' : ''}`} />
                        {saved ? 'Berhasil Disimpan!' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pengaturan;
