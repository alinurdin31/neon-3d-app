import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StrukBelanja } from '../components/documents/StrukBelanja';
import { Faktur } from '../components/documents/Faktur';
import { SuratJalan } from '../components/documents/SuratJalan';
import { SlipGaji } from '../components/documents/SlipGaji';

const PrintPage = () => {
    const { type, id } = useParams();
    const { getSaleDetails, customers, employees } = useData();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            if (type === 'slip-gaji') {
                setLoading(false);
                return;
            }

            try {
                const saleData = await getSaleDetails(id);
                // Enrich with customer data if available
                const customer = customers.find(c => c.id === saleData.customer_id);

                setTransaction({
                    ...saleData,
                    customer_address: customer?.address || '-',
                    customer_phone: customer?.phone || '-'
                });
            } catch (err) {
                console.error("Failed to fetch transaction for print:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [id, type, getSaleDetails, customers]);

    useEffect(() => {
        if (!loading && (transaction || type === 'slip-gaji')) {
            // Auto print when data is ready
            const timer = setTimeout(() => {
                window.print();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [loading, transaction, type]);

    if (type === 'slip-gaji') {
        const employee = employees.find(e => e.id.toString() === id);
        if (!employee) return <div>Data karyawan tidak ditemukan</div>;
        return <SlipGaji ref={contentRef} employee={employee} />;
    }

    // Transaction based documents
    if (loading) return <div className="p-10 text-center">Memuat data...</div>;
    if (!transaction && type !== 'slip-gaji') return <div>Transaksi tidak ditemukan: {id}</div>;

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
