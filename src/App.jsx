import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Produk from './pages/Produk';
import Stok from './pages/Stok';
import Laporan from './pages/Laporan';
import BukuBesar from './pages/BukuBesar';
import Gaji from './pages/Gaji';
import Pengeluaran from './pages/Pengeluaran';
import Jurnal from './pages/Jurnal';
import Impor from './pages/Impor';
import COA from './pages/COA';
import Pelanggan from './pages/Pelanggan';
import Pekerjaan from './pages/Pekerjaan';
import Pengaturan from './pages/Pengaturan';
import PrintPage from './pages/PrintPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { DataProvider } from './context/DataContext';
import { supabase } from './lib/supabase';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = ({ user }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Protected Routes */}
        <Route path="/" element={user ? <PageWrapper><Dashboard /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/pos" element={user ? <PageWrapper><POS /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/produk" element={user ? <PageWrapper><Produk /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/stok" element={user ? <PageWrapper><Stok /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/laporan" element={user ? <PageWrapper><Laporan /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/buku-besar" element={user ? <PageWrapper><BukuBesar /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/gaji" element={user ? <PageWrapper><Gaji /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/pengeluaran" element={user ? <PageWrapper><Pengeluaran /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/jurnal" element={user ? <PageWrapper><Jurnal /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/impor" element={user ? <PageWrapper><Impor /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/coa" element={user ? <PageWrapper><COA /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/pelanggan" element={user ? <PageWrapper><Pelanggan /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/pekerjaan" element={user ? <PageWrapper><Pekerjaan /></PageWrapper> : <Navigate to="/login" />} />
        <Route path="/pengaturan" element={user ? <PageWrapper><Pengaturan /></PageWrapper> : <Navigate to="/login" />} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setInitializing(false);
    };
    checkUser();
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/print/:type/:id" element={<PrintPage />} />

          {/* Main App Layout */}
          <Route path="/*" element={
            user ? (
              <Layout>
                <AnimatedRoutes user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
