import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // --- Initial Data (Defaults for local sync/fallback) ---
    const initialProducts = [
        { id: 101, name: 'Neon Controller Hub', category: 'Aksesoris', stock: 45, price: 550000, cost: 300000, status: 'Aktif' },
        { id: 102, name: 'Panel Matriks RGB', category: 'Tampilan', stock: 12, price: 1200000, cost: 750000, status: 'Stok Rendah' },
        { id: 103, name: 'Catu Daya Pintar', category: 'Daya', stock: 89, price: 850000, cost: 500000, status: 'Aktif' },
        { id: 104, name: 'Kit Sensor Nirkabel', category: 'Sensor', stock: 0, price: 420000, cost: 200000, status: 'Habis' },
        { id: 105, name: 'Unit Umpan Balik Haptic', category: 'Komponen', stock: 34, price: 650000, cost: 350000, status: 'Aktif' },
        { id: 106, name: 'Lampu Neon Strip X1', category: 'Pencahayaan', stock: 100, price: 250000, cost: 100000, status: 'Aktif' },
    ];


    const initialSettings = {
        name: 'Neon 3D Store',
        address: 'Jl. Teknologi Masa Depan No. 88, Jakarta',
        phone: '021-555-0123',
        email: 'info@neon3d.com',
        logoOp: 1,
    };


    const initialAccounts = [
        // 1XXX: ASET
        { code: '1100', name: 'Aset Lancar', type: 'Asset', category: 'Aset Lancar', description: '' },
        { code: '1101', name: 'Kas dan Setara Kas', type: 'Asset', category: 'Aset Lancar', description: 'Uang tunai di tangan dan saldo bank.' },
        { code: '1102', name: 'Piutang Usaha', type: 'Asset', category: 'Aset Lancar', description: 'Tagihan kepada pelanggan.' },
        { code: '1103', name: 'Persediaan Barang Dagang', type: 'Asset', category: 'Aset Lancar', description: 'Stok Glasswool siap jual (PSAK 202).' },
        { code: '1104', name: 'Pajak Dibayar di Muka', type: 'Asset', category: 'Aset Lancar', description: 'PPN Masukan atas impor/pembelian lokalan.' },
        { code: '1105', name: 'Uang Muka Supplier', type: 'Asset', category: 'Aset Lancar', description: 'Pembayaran DP untuk order kontainer (Impor).' },
        { code: '1200', name: 'Aset Tidak Lancar', type: 'Asset', category: 'Aset Lancar', description: '' },
        { code: '1201', name: 'Tanah', type: 'Asset', category: 'Aset Tetap', description: 'Aset tetap yang tidak disusutkan.' },
        { code: '1202', name: 'Bangunan (Gudang)', type: 'Asset', category: 'Aset Tetap', description: 'Nilai perolehan gudang (PSAK 216).' },
        { code: '1203', name: 'Akum. Penyusutan Bangunan', type: 'Asset', category: 'Aset Tetap', description: 'Pengurang nilai bangunan.' },
        { code: '1204', name: 'Kendaraan Operasional', type: 'Asset', category: 'Aset Tetap', description: 'Mobil box pengiriman.' },
        { code: '1205', name: 'Akum. Penyusutan Kendaraan', type: 'Asset', category: 'Aset Tetap', description: 'Pengurang nilai kendaraan.' },

        // 2XXX: LIABILITAS
        { code: '2100', name: 'Liabilitas Jangka Pendek', type: 'Liability', category: 'Kewajiban Lancar', description: '' },
        { code: '2101', name: 'Utang Usaha', type: 'Liability', category: 'Kewajiban Lancar', description: 'Utang ke supplier (misal: Hebei Binqi Trading).' },
        { code: '2102', name: 'Utang Pajak', type: 'Liability', category: 'Kewajiban Lancar', description: 'PPN Keluaran, PPh 21, PPh 23, dsb.' },
        { code: '2103', name: 'Biaya YMH Dibayar', type: 'Liability', category: 'Kewajiban Lancar', description: 'Biaya yang sudah terjadi tapi belum dibayar (Listrik, Gaji).' },
        { code: '2104', name: 'Pendapatan Diterima Dimuka', type: 'Liability', category: 'Kewajiban Lancar', description: 'DP dari customer sebelum barang dikirim.' },
        { code: '2200', name: 'Liabilitas Jangka Panjang', type: 'Liability', category: 'Kewajiban Jangka Panjang', description: '' },
        { code: '2201', name: 'Utang Bank Jangka Panjang', type: 'Liability', category: 'Kewajiban Jangka Panjang', description: 'Pinjaman modal kerja di atas 1 tahun.' },

        // 3XXX: EKUITAS
        { code: '3101', name: 'Modal Saham / Modal Pemilik', type: 'Equity', category: 'Modal', description: 'Modal disetor oleh Ali/Pemilik.' },
        { code: '3201', name: 'Saldo Laba (Retained Earnings)', type: 'Equity', category: 'Modal', description: 'Laba tahun-tahun sebelumnya yang ditahan.' },
        { code: '3301', name: 'Laba Rugi Tahun Berjalan', type: 'Equity', category: 'Modal', description: 'Hasil keuntungan periode sekarang.' },

        // 4XXX: PENDAPATAN
        { code: '4100', name: 'Pendapatan Usaha', type: 'Revenue', category: 'Pendapatan Usaha', description: 'Penjualan Glasswool (PSAK 115).' },

        // 5XXX: HPP
        { code: '5100', name: 'Harga Pokok Penjualan (HPP)', type: 'Expense', category: 'HPP', description: 'Nilai beli barang + biaya logistik impor.' },

        // 6XXX: BEBAN
        { code: '6100', name: 'Beban Operasional', type: 'Expense', category: 'Beban Operasional', description: '' },
        { code: '6101', name: 'Beban Gaji Karyawan', type: 'Expense', category: 'Beban Operasional', description: '' },
        { code: '6102', name: 'Beban Sewa / Listrik / Air', type: 'Expense', category: 'Beban Operasional', description: '' },
        { code: '6103', name: 'Beban Transportasi & BBM', type: 'Expense', category: 'Beban Operasional', description: 'Biaya pengiriman ke customer.' },
        { code: '6104', name: 'Beban Penyusutan Aset Tetap', type: 'Expense', category: 'Beban Operasional', description: 'Alokasi biaya tahunan aset (Mobil/Gudang).' },
        { code: '6105', name: 'Beban Pemasaran (Iklan)', type: 'Expense', category: 'Beban Operasional', description: 'Biaya iklan TikTok/Website.' },
    ];

    // --- State ---
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [journal, setJournal] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [settings, setSettings] = useState(initialSettings);
    const [customers, setCustomers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Sync from Supabase ---
    const fetchAllData = async () => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            setLoading(false);
            return;
        }
        setUser(userData.user);
        setLoading(true);
        try {
            const { data: p } = await supabase.from('products').select();
            const { data: e } = await supabase.from('employees').select();
            const { data: c } = await supabase.from('customers').select();
            const { data: j } = await supabase.from('jobs').select();
            const { data: s } = await supabase.from('app_settings').select();
            const { data: coa } = await supabase.from('chart_of_accounts').select();

            // Complex fetch for journal (header + lines)
            const { data: j_entries } = await supabase.from('journal_entries').select();
            const { data: j_lines } = await supabase.from('journal_lines').select();

            // Map DB fields to local state names if needed
            // Seed initial data if Supabase is empty (only App Settings)
            if (Array.isArray(s) && s.length === 0) {
                console.log('Seeding initial settings...');
                await updateSettings(initialSettings);
            } else if (Array.isArray(s) && s.length > 0) {
                setSettings({ ...s[0], logoOp: s[0].logo_op, stampUrl: s[0].stamp_url });
            }

            setAccounts(Array.isArray(coa) ? coa : []);

            // Map and Set for the rest
            const currentP = Array.isArray(p) ? p : [];
            setProducts(currentP.map(x => ({ ...x, cost: Number(x.cost_price || x.cost), imageUrl: x.image_url })));

            const currentE = Array.isArray(e) ? e : [];
            setEmployees(currentE.map(x => ({ ...x, joinDate: x.join_date || x.joinDate })));

            setCustomers(Array.isArray(c) ? c : []);
            setJobs((Array.isArray(j) ? j : []).map(x => ({ ...x, customerId: x.customer_id, employeeId: x.employee_id })));

            // Reconstruct Journal
            const entriesArr = Array.isArray(j_entries) ? j_entries : [];
            const linesArr = Array.isArray(j_lines) ? j_lines : [];

            const fullJournal = entriesArr.map(entry => ({
                ...entry,
                desc: entry.description,
                ref: entry.reference,
                lines: linesArr.filter(l => l.entry_id === entry.id)
            }));
            setJournal(fullJournal);

            // Fetch Transactions (Sales)
            const { data: sales } = await supabase.from('sales').select();
            setTransactions(Array.isArray(sales) ? sales : []);

        } catch (err) {
            console.error('Initial fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllData(); }, []);

    // --- Helpers ---
    const getAccountByPaymentMethod = (method) => {
        switch (method) {
            case 'QRIS': return '1103'; // Assuming Piutang QRIS or similar
            case 'Bank': return '1101';
            default: return '1101';
        }
    };

    // --- Actions ---

    const processSale = async (cart, paymentDetails) => {
        const txId = `INV-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        const customer = customers.find(c => c.id === parseInt(paymentDetails.customerId)) || customers[0];

        const totalCost = cart.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
        const subtotal = paymentDetails.subtotal;
        const discount = paymentDetails.discount || 0;
        const shipping = paymentDetails.shipping || 0;
        const finalTotal = paymentDetails.total;
        const paymentAccount = getAccountByPaymentMethod(paymentDetails.method);

        // 1. Transaction (Sales)
        const salePayload = {
            // id: txId, // Auto-sync might clash with serial PK if DB uses serial, but let's assume we use auto-increment
            customer_id: customer.id,
            customer_name: customer.name,
            total: finalTotal,
            payment_method: paymentDetails.method,
            status: 'completed'
        };
        const { data: saleData } = await supabase.from('sales').insert(salePayload);
        const realSaleId = saleData[0]?.id;

        // 2. Sale Items
        const saleItems = cart.map(item => ({
            sale_id: realSaleId,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            cost_price: item.cost
        }));
        await supabase.from('sale_items').insert(saleItems);

        // 3. Stock Deduct
        for (const item of cart) {
            const prod = products.find(p => p.id === item.id);
            if (prod) {
                const newStock = prod.stock - item.quantity;
                await supabase.from('products').update({ id: item.id }, {
                    stock: newStock,
                    status: newStock <= 0 ? 'Habis' : newStock < 10 ? 'Stok Rendah' : 'Aktif'
                });
            }
        }

        // 4. Accounting (PSAK)
        let debits = [];
        let credits = [];
        debits.push({ code: paymentAccount, amount: finalTotal });
        // Use 4100 for revenue/discount/shipping for now as other specific accounts were not provided by user
        credits.push({ code: '4100', amount: subtotal });
        if (shipping > 0) credits.push({ code: '4100', amount: shipping });

        await addJournalEntry({
            date,
            desc: `Penjualan ${txId} - ${customer.name}`,
            ref: txId,
            lines: [
                ...debits.map(d => ({ code: d.code, debit: d.amount, credit: 0 })),
                ...credits.map(c => ({ code: c.code, debit: 0, credit: c.amount }))
            ]
        });

        // 5. COGS
        await addJournalEntry({
            date,
            desc: `HPP Penjualan ${txId}`,
            ref: txId,
            lines: [
                { code: '5100', debit: totalCost, credit: 0 },
                { code: '1103', debit: 0, credit: totalCost }
            ]
        });

        fetchAllData(); // Refresh UI
    };

    const getSaleDetails = async (saleId) => {
        const { data: sale } = await supabase.from('sales').select('*').match({ id: saleId }).single();
        const { data: items } = await supabase.from('sale_items').select('*').match({ sale_id: saleId });
        return { ...sale, items: items || [] };
    };

    const paySalary = async (employeeId) => {
        const emp = employees.find(e => e.id === employeeId);
        if (!emp) return;

        const txId = `PAY-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];

        await supabase.from('employees').update({ id: employeeId }, { status: 'Dibayar' });

        await addJournalEntry({
            date,
            desc: `Pembayaran Gaji - ${emp.name}`,
            ref: txId,
            lines: [
                { code: '6101', debit: emp.salary, credit: 0 },
                { code: '1101', debit: 0, credit: emp.salary }
            ]
        });

        fetchAllData();
    };

    const restockProduct = async (item, qty, costPerUnit, totalCost, paymentMethod) => {
        const txId = `PUR-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        const accountCode = getAccountByPaymentMethod(paymentMethod);

        await supabase.from('products').update({ id: item.id }, {
            stock: item.stock + parseInt(qty),
            cost_price: parseInt(costPerUnit),
            status: 'Aktif'
        });

        await addJournalEntry({
            date,
            desc: `Restock: ${item.name} (${qty} pcs)`,
            ref: txId,
            lines: [
                { code: '1103', debit: totalCost, credit: 0 },
                { code: accountCode, debit: 0, credit: totalCost }
            ]
        });

        fetchAllData();
    };

    const addJournalEntry = async ({ date, desc, ref, lines }) => {
        const entryId = `JV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 1. Header
        await supabase.from('journal_entries').insert({
            id: entryId,
            date,
            description: desc,
            reference: ref
        });

        // 2. Lines
        const linePayloads = lines.map(line => ({
            entry_id: entryId,
            account_code: line.code,
            debit: line.debit,
            credit: line.credit
        }));
        await supabase.from('journal_lines').insert(linePayloads);

        fetchAllData();
    };

    // 5. Clear All Data (Reset)
    const clearAllData = async () => {
        setLoading(true);
        try {
            // Delete in correct order to avoid foreign key violations
            const tables = [
                'sale_items',
                'sales',
                'journal_lines',
                'journal_entries',
                'jobs',
                'employees',
                'products',
                'customers',
                'chart_of_accounts',
                'app_settings'
            ];

            for (const t of tables) {
                let result;
                if (t === 'chart_of_accounts') {
                    result = await supabase.from(t).delete({ code: 'not.is.null' });
                } else if (t === 'app_settings') {
                    result = await supabase.from(t).delete({ id: 'eq.1' });
                } else if (t === 'journal_entries') {
                    result = await supabase.from(t).delete({ id: 'not.is.null' });
                } else {
                    result = await supabase.from(t).delete({});
                }
            }

            // ONLY Default Settings are re-seeded automatically
            await updateSettings(initialSettings);

            window.location.reload();
        } catch (error) {
            console.error("Reset Error:", error);
            alert("Gagal mereset database. Silakan coba lagi.");
            setLoading(false);
        }
    };

    const seedInitialCOA = async () => {
        setLoading(true);
        try {
            await supabase.from('chart_of_accounts').insert(initialAccounts);
            alert("COA berhasil di-seed!");
            fetchAllData();
        } catch (error) {
            console.error("Seed COA Error:", error);
            alert("Gagal seeding COA.");
        } finally {
            setLoading(false);
        }
    };

    const seedInitialProducts = async () => {
        setLoading(true);
        try {
            await supabase.from('products').insert(initialProducts.map(x => ({
                name: x.name, category: x.category, price: x.price, cost_price: x.cost, stock: x.stock, status: x.status
            })));
            alert("Produk berhasil di-seed!");
            fetchAllData();
        } catch (error) {
            console.error("Seed Products Error:", error);
            alert("Gagal seeding Produk.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            await supabase.auth.signOut();
            setUser(null);
        }
    };

    const importProducts = async (productsList) => {
        setLoading(true);
        try {
            const formatted = productsList.map(p => ({
                name: p.name,
                category: p.category,
                price: Number(p.price),
                cost_price: Number(p.cost),
                stock: 0, // Forced to 0 as requested
                status: 'Aktif'
            }));

            await supabase.from('products').insert(formatted);
            fetchAllData();
            return true;
        } catch (error) {
            console.error("Import Products Error:", error);
            alert("Gagal meng-import produk.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // CRUDs with Supabase Sync
    const addProduct = async (p) => {
        await supabase.from('products').insert({
            name: p.name,
            category: p.category,
            price: p.price,
            cost_price: p.cost,
            stock: p.stock,
            status: p.status,
            image_url: p.imageUrl
        });
        fetchAllData();
    };

    const updateProduct = async (id, p) => {
        await supabase.from('products').update({ id }, {
            name: p.name,
            category: p.category,
            price: p.price,
            cost_price: p.cost,
            stock: p.stock,
            status: p.status,
            image_url: p.imageUrl
        });
        fetchAllData();
    };

    const deleteProduct = async (id) => {
        await supabase.from('products').delete({ id });
        fetchAllData();
    };

    const addEmployee = async (e) => {
        await supabase.from('employees').insert({
            name: e.name,
            role: e.role,
            salary: e.salary,
            status: e.status,
            join_date: e.joinDate,
            phone: e.phone
        });
        fetchAllData();
    };

    const updateEmployee = async (id, e) => {
        await supabase.from('employees').update({ id }, {
            name: e.name,
            role: e.role,
            salary: e.salary,
            status: e.status,
            join_date: e.joinDate,
            phone: e.phone
        });
        fetchAllData();
    };

    const deleteEmployee = async (id) => {
        await supabase.from('employees').delete({ id });
        fetchAllData();
    };

    const addCustomer = async (c) => {
        await supabase.from('customers').insert({
            name: c.name,
            phone: c.phone,
            address: c.address
        });
        fetchAllData();
    };

    const updateCustomer = async (id, c) => {
        await supabase.from('customers').update({ id }, {
            name: c.name,
            phone: c.phone,
            address: c.address
        });
        fetchAllData();
    };

    const deleteCustomer = async (id) => {
        await supabase.from('customers').delete({ id });
        fetchAllData();
    };

    const addAccount = async (a) => {
        await supabase.from('chart_of_accounts').insert(a);
        fetchAllData();
    };

    const updateAccount = async (code, a) => {
        await supabase.from('chart_of_accounts').update({ code }, a);
        fetchAllData();
    };

    const deleteAccount = async (code) => {
        await supabase.from('chart_of_accounts').delete({ code });
        fetchAllData();
    };

    const addJob = async (j) => {
        await supabase.from('jobs').insert({
            id: j.id,
            title: j.title,
            customer_id: j.customerId,
            employee_id: j.employeeId,
            status: j.status,
            deadline: j.deadline,
            desc: j.desc,
            cost: j.cost
        });
        fetchAllData();
    };

    const updateJob = async (id, j) => {
        await supabase.from('jobs').update({ id }, {
            title: j.title,
            customer_id: j.customerId,
            employee_id: j.employeeId,
            status: j.status,
            deadline: j.deadline,
            desc: j.desc,
            cost: j.cost
        });
        fetchAllData();
    };

    const deleteJob = async (id) => {
        await supabase.from('jobs').delete({ id });
        fetchAllData();
    };

    const updateSettings = async (s) => {
        await supabase.from('app_settings').upsert({
            id: 1,
            name: s.name,
            address: s.address,
            phone: s.phone,
            email: s.email,
            logo_op: s.logoOp,
            stamp_url: s.stampUrl
        });
        fetchAllData();
    };

    return (
        <DataContext.Provider value={{
            products, transactions, journal, employees, accounts, settings, customers, jobs, loading, user,
            processSale, paySalary, restockProduct, addJournalEntry, clearAllData, logout,
            seedInitialCOA, seedInitialProducts, importProducts, getSaleDetails,
            addProduct, updateProduct, deleteProduct,
            addEmployee, updateEmployee, deleteEmployee,
            addCustomer, updateCustomer, deleteCustomer,
            addAccount, updateAccount, deleteAccount,
            addJob, updateJob, deleteJob,
            updateSettings, fetchAllData
        }}>
            {children}
        </DataContext.Provider>
    );
};
