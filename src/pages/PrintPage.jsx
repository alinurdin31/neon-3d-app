import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StrukBelanja } from '../components/documents/StrukBelanja';
import { Faktur } from '../components/documents/Faktur';
import { SuratJalan } from '../components/documents/SuratJalan';
import { SlipGaji } from '../components/documents/SlipGaji';

const PrintPage = () => {
    const { type, id } = useParams();
    const { transactions, employees } = useData();
    const contentRef = useRef(null);

    useEffect(() => {
        // Auto print when page loads
        const timer = setTimeout(() => {
            window.print();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (type === 'slip-gaji') {
        const employee = employees.find(e => e.id.toString() === id);
        if (!employee) return <div>Data karyawan tidak ditemukan</div>;
        return <SlipGaji ref={contentRef} employee={employee} />;
    }

    // Transaction based documents
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return <div>Transaksi tidak ditemukan: {id}</div>;

    switch (type) {
        case 'struk':
            return <div className="flex justify-center"><StrukBelanja ref={contentRef} transaction={transaction} /></div>;
        case 'faktur':
            return <Faktur ref={contentRef} transaction={transaction} />;
        case 'surat-jalan':
            return <SuratJalan ref={contentRef} transaction={transaction} />;
        default:
            return <div>Dokumen tidak dikenal</div>;
    }
};

export default PrintPage;
