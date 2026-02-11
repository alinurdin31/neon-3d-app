import React, { useState } from 'react';
import { Save, Store, MapPin, Phone, Mail, Image } from 'lucide-react';
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
            <header>
                <h1 className="text-3xl font-bold neon-text text-white mb-2">Pengaturan Toko</h1>
                <p className="text-gray-400">Konfigurasi identitas toko untuk dokumen dan struk.</p>
            </header>

            <div className="glass-card p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                <Store className="w-4 h-4" /> Nama Toko
                            </label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Alamat Lengkap
                            </label>
                            <textarea
                                name="address" value={formData.address} onChange={handleChange} rows="3"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Telepon
                                </label>
                                <input
                                    type="text" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email
                                </label>
                                <input
                                    type="text" name="email" value={formData.email} onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                            <Image className="w-4 h-4" /> Logo Toko (Pilih Style)
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(op => (
                                <div
                                    key={op}
                                    onClick={() => setFormData({ ...formData, logoOp: op })}
                                    className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-center aspect-square transition-all ${formData.logoOp === op
                                            ? 'border-neon-purple bg-neon-purple/10 shadow-[0_0_15px_rgba(188,19,254,0.3)]'
                                            : 'border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    {op === 1 && <div className="text-4xl font-bold font-neon text-neon-cyan">N3D</div>}
                                    {op === 2 && <div className="w-12 h-12 bg-gradient-to-tr from-neon-pink to-neon-purple rounded-full"></div>}
                                    {op === 3 && <Store className="w-12 h-12 text-white" />}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">Logo ini akan muncul pada Struk dan Faktur.</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all shadow-lg ${saved ? 'bg-green-500 shadow-green-500/30' : 'bg-gradient-to-r from-neon-cyan to-blue-500 shadow-neon-cyan/30 hover:scale-105'
                            }`}
                    >
                        <Save className="w-5 h-5" />
                        {saved ? 'Tersimpan!' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pengaturan;
