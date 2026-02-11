import React from 'react';
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
import { DataProvider } from './context/DataContext';

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

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/pos" element={<PageWrapper><POS /></PageWrapper>} />
        <Route path="/produk" element={<PageWrapper><Produk /></PageWrapper>} />
        <Route path="/stok" element={<PageWrapper><Stok /></PageWrapper>} />
        <Route path="/laporan" element={<PageWrapper><Laporan /></PageWrapper>} />
        <Route path="/buku-besar" element={<PageWrapper><BukuBesar /></PageWrapper>} />
        <Route path="/gaji" element={<PageWrapper><Gaji /></PageWrapper>} />
        <Route path="/pengeluaran" element={<PageWrapper><Pengeluaran /></PageWrapper>} />
        <Route path="/jurnal" element={<PageWrapper><Jurnal /></PageWrapper>} />
        <Route path="/impor" element={<PageWrapper><Impor /></PageWrapper>} />
        <Route path="/coa" element={<PageWrapper><COA /></PageWrapper>} />
        <Route path="/pelanggan" element={<PageWrapper><Pelanggan /></PageWrapper>} />
        <Route path="/pekerjaan" element={<PageWrapper><Pekerjaan /></PageWrapper>} />
        <Route path="/pengaturan" element={<PageWrapper><Pengaturan /></PageWrapper>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/print/:type/:id" element={<PrintPage />} />
          <Route path="/*" element={
            <Layout>
              <AnimatedRoutes />
            </Layout>
          } />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
