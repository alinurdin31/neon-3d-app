import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signIn({ email, password });

        if (error) {
            setError(error.error_description || error.msg || error.message || 'Login gagal. Periksa kembali email dan password Anda.');
            setLoading(false);
        } else {
            // Use window.location.href for a clean, full-app reset and direct navigation
            window.location.href = '/';
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 relative z-10 border border-white/10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-neon-cyan to-neon-purple rounded-2xl shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center mb-4 transition-transform hover:scale-110">
                        <span className="text-2xl font-bold text-white font-neon">N3D</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang</h1>
                    <p className="text-gray-400 text-sm">Masuk ke akun Neon 3D Store Anda</p>
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

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
                                placeholder="admin@example.com"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-neon-cyan to-blue-600 text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                Masuk Sekarang
                            </>
                        )}
                    </button>
                </form>

            </motion.div>

            {/* Footer info */}
            <div className="absolute bottom-8 text-center text-gray-600 text-[10px] uppercase tracking-[0.2em]">
                Neon 3D Ecosystem © 2026 • Secure Infrastructure
            </div>
        </div>
    );
};

export default Login;
