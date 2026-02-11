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

    const initialEmployees = [
        { id: 1, name: 'Alice Cyber', role: 'Manajer Toko', salary: 4500000, status: 'Menunggu', joinDate: '2023-01-15', phone: '081234567890' },
        { id: 2, name: 'Bob Nexus', role: 'Sales Associate', salary: 3200000, status: 'Menunggu', joinDate: '2023-03-10', phone: '089876543210' },
    ];

    const initialSettings = {
        name: 'Neon 3D Store',
        address: 'Jl. Teknologi Masa Depan No. 88, Jakarta',
        phone: '021-555-0123',
        email: 'info@neon3d.com',
        logoOp: 1,
    };

    const initialCustomers = [
        { id: 1, name: 'Pelanggan Umum', phone: '-', address: '-' },
        { id: 2, name: 'PT. Teknologi Maju', phone: '021-999-888', address: 'Kawasan Industri Pulo Gadung' },
    ];

    const initialAccounts = [
        // 1-XXXX: ASET
        { code: '1-1100', name: 'Kas Tunai', type: 'Aset', category: 'Aset Lancar', description: 'Uang kas di tangan' },
        { code: '1-1110', name: 'Bank BCA', type: 'Aset', category: 'Aset Lancar', description: 'Rekening operasional' },
        { code: '1-1130', name: 'Piutang QRIS', type: 'Aset', category: 'Aset Lancar', description: 'Dana mengendap dari QRIS' },
        { code: '1-1200', name: 'Piutang Usaha', type: 'Aset', category: 'Aset Lancar', description: 'Tagihan ke pelanggan' },
        { code: '1-1300', name: 'Persediaan Barang', type: 'Aset', category: 'Aset Lancar', description: 'Stok produk 3D' },
        { code: '1-2100', name: 'Peralatan 3D Printer', type: 'Aset', category: 'Aset Tetap', description: 'Mesin printer 3D' },

        // 2-XXXX: KEWAJIBAN
        { code: '2-1100', name: 'Hutang Dagang', type: 'Kewajiban', category: 'Kewajiban Lancar', description: 'Hutang ke supplier' },
        { code: '2-1200', name: 'Hutang Gaji', type: 'Kewajiban', category: 'Kewajiban Lancar', description: 'Gaji belum dibayar' },

        // 3-XXXX: EKUITAS
        { code: '3-1000', name: 'Modal Pemilik', type: 'Ekuitas', category: 'Modal', description: 'Modal awal' },
        { code: '3-2000', name: 'Laba Ditahan', type: 'Ekuitas', category: 'Modal', description: 'Akumulasi keuntungan' },

        // 4-XXXX: PENDAPATAN
        { code: '4-1000', name: 'Pendapatan Penjualan', type: 'Pendapatan', category: 'Pendapatan Usaha', description: 'Hasil penjualan produk' },
        { code: '4-2000', name: 'Pendapatan Jasa Cetak', type: 'Pendapatan', category: 'Pendapatan Usaha', description: 'Hasil jasa desain/cetak' },
        { code: '4-3000', name: 'Pendapatan Pengiriman', type: 'Pendapatan', category: 'Pendapatan Lain', description: 'Ongkos kirim' },

        // 5-XXXX: HARGA POKOK PENJUALAN
        { code: '5-1000', name: 'HPP Penjualan', type: 'Beban', category: 'HPP', description: 'Harga pokok barang terjual' },
        { code: '5-2000', name: 'Diskon Penjualan', type: 'Beban', category: 'Diskon', description: 'Potongan harga' },

        // 6-XXXX: BEBAN
        { code: '6-1000', name: 'Beban Gaji Karyawan', type: 'Beban', category: 'Beban Operasional', description: 'Gaji bulanan' },
        { code: '6-2000', name: 'Beban Listrik & Internet', type: 'Beban', category: 'Beban Operasional', description: 'Utilitas' },
        { code: '6-3000', name: 'Beban Sewa Tempat', type: 'Beban', category: 'Beban Operasional', description: 'Sewa gedung' },
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
            // Seed initial data if Supabase is empty
            if (Array.isArray(coa) && coa.length === 0) {
                console.log('Seeding COA to Supabase...');
                await supabase.from('chart_of_accounts').insert(initialAccounts);
                const { data: newCoa } = await supabase.from('chart_of_accounts').select();
                setAccounts(newCoa || initialAccounts);
            } else if (Array.isArray(coa)) {
                setAccounts(coa);
            } else {
                setAccounts(initialAccounts);
            }

            if (Array.isArray(p) && p.length === 0) {
                console.log('Seeding initial products to Supabase...');
                await supabase.from('products').insert(initialProducts.map(x => ({
                    name: x.name, category: x.category, price: x.price, cost_price: x.cost, stock: x.stock, status: x.status
                })));
            }

            if (Array.isArray(s) && s.length === 0) {
                console.log('Seeding initial settings...');
                await updateSettings(initialSettings);
            } else if (Array.isArray(s) && s.length > 0) {
                setSettings({ ...s[0], logoOp: s[0].logo_op, stampUrl: s[0].stamp_url });
            }

            // Map and Set for the rest
            const currentP = Array.isArray(p) && p.length > 0 ? p : initialProducts;
            setProducts(currentP.map(x => ({ ...x, cost: Number(x.cost_price || x.cost), imageUrl: x.image_url })));

            const currentE = Array.isArray(e) && e.length > 0 ? e : initialEmployees;
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
            case 'QRIS': return '1-1130';
            case 'Bank': return '1-1110';
            default: return '1-1100';
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
                const newStock = Math.max(0, prod.stock - item.quantity);
                await supabase.from('products').update({ id: item.id }, {
                    stock: newStock,
                    status: newStock === 0 ? 'Habis' : newStock < 10 ? 'Stok Rendah' : 'Aktif'
                });
            }
        }

        // 4. Accounting (PSAK)
        let debits = [];
        let credits = [];
        debits.push({ code: paymentAccount, amount: finalTotal });
        if (discount > 0) debits.push({ code: '5-2000', amount: discount });
        credits.push({ code: '4-1000', amount: subtotal });
        if (shipping > 0) credits.push({ code: '4-3000', amount: shipping });

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
                { code: '5-1000', debit: totalCost, credit: 0 },
                { code: '1-1300', debit: 0, credit: totalCost }
            ]
        });

        fetchAllData(); // Refresh UI
        return txId;
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
                { code: '6-1000', debit: emp.salary, credit: 0 },
                { code: '1-1110', debit: 0, credit: emp.salary }
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
                { code: '1-1300', debit: totalCost, credit: 0 },
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
                // Specialized deletion for tables without 'id' column or specific constraints
                if (t === 'chart_of_accounts') {
                    result = await supabase.from(t).delete({ code: 'not.is.null' });
                } else if (t === 'app_settings') {
                    result = await supabase.from(t).delete({ id: 'eq.1' });
                } else if (t === 'journal_entries') {
                    // journal_entries has text id
                    result = await supabase.from(t).delete({ id: 'not.is.null' });
                } else {
                    result = await supabase.from(t).delete({});
                }

                if (result.error) {
                    console.error(`Failed to clear table ${t}:`, result.error);
                } else {
                    console.log(`Table ${t} cleared successfully.`);
                }
            }

            // Re-seed with essential system data only
            // 1. Chart of Accounts
            await supabase.from('chart_of_accounts').insert(initialAccounts);

            // 2. Default Settings
            await updateSettings(initialSettings);

            window.location.reload();
        } catch (error) {
            console.error("Reset Error:", error);
            alert("Gagal mereset database. Silakan coba lagi.");
            setLoading(false);
        }
    };

    const logout = async () => {
        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            await supabase.auth.signOut();
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
