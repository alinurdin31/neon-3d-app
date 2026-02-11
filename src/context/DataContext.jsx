import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // --- Initial Data ---
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

    // PSAK Standard COA
    const initialAccounts = [
        // 1-xxxx ASET (ASSETS)
        { code: '1-1100', name: 'Kas Tunai', type: 'Asset' },
        { code: '1-1110', name: 'Bank BCA', type: 'Asset' },
        { code: '1-1120', name: 'QRIS / E-Wallet', type: 'Asset' },
        { code: '1-1200', name: 'Piutang Usaha', type: 'Asset' },
        { code: '1-1300', name: 'Persediaan Barang Dagang', type: 'Asset' },

        // 2-xxxx KEWAJIBAN (LIABILITIES)
        { code: '2-1100', name: 'Hutang Usaha', type: 'Liability' },
        { code: '2-1200', name: 'Hutang Gaji', type: 'Liability' },

        // 3-xxxx EKUITAS (EQUITY)
        { code: '3-1000', name: 'Modal Pemilik', type: 'Equity' },
        { code: '3-2000', name: 'Prive Pemilik', type: 'Equity' },

        // 4-xxxx PENDAPATAN (REVENUE)
        { code: '4-1000', name: 'Pendapatan Penjualan', type: 'Revenue' },
        { code: '4-2000', name: 'Pendapatan Jasa / Lainnya', type: 'Revenue' },

        // 5-xxxx BEBAN POKOK (COGS)
        { code: '5-1000', name: 'Harga Pokok Penjualan (HPP)', type: 'Expense' },
        { code: '5-2000', name: 'Potongan Penjualan', type: 'Expense' },

        // 6-xxxx BEBAN OPERASIONAL (EXPENSES)
        { code: '6-1000', name: 'Beban Gaji & Upah', type: 'Expense' },
        { code: '6-2000', name: 'Beban Listrik, Air & Internet', type: 'Expense' },
        { code: '6-3000', name: 'Beban Operasional Lainnya', type: 'Expense' },
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

    // --- State ---
    const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('products')) || initialProducts);
    const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('transactions')) || []);
    const [journal, setJournal] = useState(() => JSON.parse(localStorage.getItem('journal')) || []);
    const [employees, setEmployees] = useState(() => JSON.parse(localStorage.getItem('employees')) || initialEmployees);
    const [accounts, setAccounts] = useState(() => JSON.parse(localStorage.getItem('accounts')) || initialAccounts);
    const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('settings')) || initialSettings);
    const [customers, setCustomers] = useState(() => JSON.parse(localStorage.getItem('customers')) || initialCustomers);
    const [jobs, setJobs] = useState(() => JSON.parse(localStorage.getItem('jobs')) || []);

    // --- Persistence ---
    useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('transactions', JSON.stringify(transactions)); }, [transactions]);
    useEffect(() => { localStorage.setItem('journal', JSON.stringify(journal)); }, [journal]);
    useEffect(() => { localStorage.setItem('employees', JSON.stringify(employees)); }, [employees]);
    useEffect(() => { localStorage.setItem('accounts', JSON.stringify(accounts)); }, [accounts]);
    useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);
    useEffect(() => { localStorage.setItem('customers', JSON.stringify(customers)); }, [customers]);
    useEffect(() => { localStorage.setItem('jobs', JSON.stringify(jobs)); }, [jobs]);

    // --- Helpers ---
    const getAccountByPaymentMethod = (method) => {
        switch (method) {
            case 'QRIS': return '1-1120'; // QRIS
            case 'Bank': return '1-1110'; // Bank BCA
            default: return '1-1100'; // Kas Tunai
        }
    };

    // --- Actions ---

    // 1. Process Sale (POS) - Connected to PSAK
    const processSale = (cart, paymentDetails) => {
        const txId = `INV-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        const customer = customers.find(c => c.id === parseInt(paymentDetails.customerId)) || customers[0];

        // Calculate totals
        const totalCost = cart.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
        const subtotal = paymentDetails.subtotal;
        const discount = paymentDetails.discount || 0;
        const shipping = paymentDetails.shipping || 0;
        const finalTotal = paymentDetails.total;
        const paymentAccount = getAccountByPaymentMethod(paymentDetails.method);

        // A. Transaction Record
        const newTx = {
            id: txId,
            date,
            type: 'Penjualan',
            items: cart,
            subtotal,
            discount,
            shipping,
            total: finalTotal,
            paymentMethod: paymentDetails.method,
            customerId: customer.id,
            customerName: customer.name,
            customerAddress: customer.address
        };
        setTransactions(prev => [newTx, ...prev]);

        // B. Deduct Stock
        const newProducts = products.map(p => {
            const cartItem = cart.find(c => c.id === p.id);
            if (cartItem) {
                const newStock = p.stock - cartItem.quantity;
                return {
                    ...p,
                    stock: Math.max(0, newStock),
                    status: newStock === 0 ? 'Habis' : newStock < 10 ? 'Stok Rendah' : 'Aktif'
                };
            }
            return p;
        });
        setProducts(newProducts);

        // C. Accounting (PSAK)
        let debits = [];
        let credits = [];

        // 1. Receive Payment (Dr. Cash/Bank)
        debits.push({ code: paymentAccount, amount: finalTotal });

        // 2. Sales Discount (Dr. Expense)
        if (discount > 0) {
            debits.push({ code: '5-2000', amount: discount });
        }

        // 3. Revenue (Cr. Sales)
        credits.push({ code: '4-1000', amount: subtotal });

        // 4. Shipping (Cr. Other Revenue)
        if (shipping > 0) {
            credits.push({ code: '4-2000', amount: shipping });
        }

        addJournalEntry({
            date,
            desc: `Penjualan ${txId} - ${customer.name}`,
            ref: txId,
            lines: [
                ...debits.map(d => ({ code: d.code, debit: d.amount, credit: 0 })),
                ...credits.map(c => ({ code: c.code, debit: 0, credit: c.amount }))
            ]
        });

        // 5. COGS (Dr. HPP, Cr. Inventory)
        addJournalEntry({
            date,
            desc: `HPP Penjualan ${txId}`,
            ref: txId,
            lines: [
                { code: '5-1000', debit: totalCost, credit: 0 }, // Dr HPP
                { code: '1-1300', debit: 0, credit: totalCost }  // Cr Inventory
            ]
        });

        return txId;
    };

    // 2. Process Payroll (Connected to PSAK)
    const paySalary = (employeeId) => {
        const emp = employees.find(e => e.id === employeeId);
        if (!emp) return;

        const txId = `PAY-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];

        setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, status: 'Dibayar' } : e));

        setTransactions(prev => [{
            id: txId,
            date,
            type: 'Pengeluaran',
            category: 'Gaji',
            desc: `Gaji Bulan Ini - ${emp.name}`,
            total: emp.salary,
            paymentMethod: 'Transfer'
        }, ...prev]);

        // Dr Beban Gaji (6-1000), Cr Bank BCA (1-1110)
        addJournalEntry({
            date,
            desc: `Pembayaran Gaji - ${emp.name}`,
            ref: txId,
            lines: [
                { code: '6-1000', debit: emp.salary, credit: 0 },
                { code: '1-1110', debit: 0, credit: emp.salary }
            ]
        });
    };

    // 3. Purchase / Restock (New Feature)
    const restockProduct = (item, qty, costPerUnit, totalCost, paymentMethod) => {
        const txId = `PUR-${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        const accountCode = getAccountByPaymentMethod(paymentMethod);

        // Update Product Stock & Cost
        const newProducts = products.map(p => {
            if (p.id === item.id) {
                // Weighted Average Cost calculation could go here, but keeping simple for now
                return {
                    ...p,
                    stock: p.stock + parseInt(qty),
                    cost: parseInt(costPerUnit), // Update latest cost
                    status: 'Aktif'
                };
            }
            return p;
        });
        setProducts(newProducts);

        // Journal: Dr Inventory (1-1300), Cr Cash/Bank
        addJournalEntry({
            date,
            desc: `Restock: ${item.name} (${qty} pcs)`,
            ref: txId,
            lines: [
                { code: '1-1300', debit: totalCost, credit: 0 },
                { code: accountCode, debit: 0, credit: totalCost }
            ]
        });
    };

    // 4. Add General Journal Entry
    const addJournalEntry = ({ date, desc, ref, lines }) => {
        const entryId = `JV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newEntry = {
            id: entryId, date, desc, ref, lines
        };
        setJournal(prev => [newEntry, ...prev]);
    };

    // CRUDs
    const addProduct = (p) => setProducts([...products, { ...p, id: Date.now() }]);
    const updateProduct = (id, p) => setProducts(products.map(x => x.id === id ? { ...x, ...p } : x));
    const deleteProduct = (id) => setProducts(products.filter(x => x.id !== id));

    const addEmployee = (e) => setEmployees([...employees, { ...e, id: Date.now() }]);
    const updateEmployee = (id, e) => setEmployees(employees.map(x => x.id === id ? { ...x, ...e } : x));
    const deleteEmployee = (id) => setEmployees(employees.filter(x => x.id !== id));

    const addCustomer = (c) => setCustomers([...customers, { ...c, id: Date.now() }]);
    const updateCustomer = (id, c) => setCustomers(customers.map(x => x.id === id ? { ...x, ...c } : x));
    const deleteCustomer = (id) => setCustomers(customers.filter(x => x.id !== id));

    const addAccount = (a) => setAccounts([...accounts, { ...a }]);
    const updateAccount = (code, a) => setAccounts(accounts.map(x => x.code === code ? { ...x, ...a } : x));
    const deleteAccount = (code) => setAccounts(accounts.filter(x => x.code !== code));

    const addJob = (j) => setJobs([...jobs, { ...j, id: `JOB-${Date.now()}` }]);
    const updateJob = (id, j) => setJobs(jobs.map(x => x.id === id ? { ...x, ...j } : x));
    const deleteJob = (id) => setJobs(jobs.filter(x => x.id !== id));

    const updateSettings = (s) => setSettings({ ...settings, ...s });
    const resetData = () => { localStorage.clear(); window.location.reload(); };

    return (
        <DataContext.Provider value={{
            products, transactions, journal, employees, accounts, settings, customers, jobs,
            processSale, paySalary, restockProduct, addJournalEntry,
            addProduct, updateProduct, deleteProduct,
            addEmployee, updateEmployee, deleteEmployee,
            addCustomer, updateCustomer, deleteCustomer,
            addAccount, updateAccount, deleteAccount,
            addJob, updateJob, deleteJob,
            updateSettings, resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};
