import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            data: { display_name: name }
        });

        if (error) {
            setError(error.msg || error.message || error.error_description || 'Pendaftaran gagal. Pastikan email belum terdaftar atau periksa koneksi.');
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => navigate('/login'), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 relative z-10 border border-white/10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-neon-pink to-neon-purple rounded-2xl shadow-[0_0_20px_rgba(255,0,255,0.3)] flex items-center justify-center mb-4 transition-transform hover:scale-110">
                        <span className="text-2xl font-bold text-white font-neon">N3D</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Buat Akun</h1>
                    <p className="text-gray-400 text-sm">Bergabung dengan ekosistem Neon 3D</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500 text-sm"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 space-y-4"
                    >
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/50">
                            <UserPlus className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Pendaftaran Berhasil!</h2>
                        <p className="text-gray-400">Anda akan diarahkan ke halaman masuk dalam beberapa saat...</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,0,255,0.1)] transition-all"
                                    placeholder="Nama Toko atau Pribadi"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all"
                                    placeholder="email@bisnis.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-purple focus:shadow-[0_0_15px_rgba(188,19,254,0.1)] transition-all"
                                    placeholder="Min. 6 karakter"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,0,255,0.2)] hover:shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Daftar Sekarang
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-sm">
                        Sudah memiliki akun?{' '}
                        <Link to="/login" className="text-neon-cyan hover:underline font-bold">
                            Masuk Disini
                        </Link>
                    </p>
                </div>
            </motion.div>

            <div className="absolute bottom-8 text-center text-gray-600 text-[10px] uppercase tracking-[0.2em]">
                Join the 3D Printing Revolution
            </div>
        </div>
    );
};

export default Register;
