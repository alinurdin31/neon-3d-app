import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DataTable = ({
    title,
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
    searchPlaceholder = "Cari data..."
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter Data
    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="glass-card p-6 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold neon-text text-white">{title}</h2>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-neon-cyan"
                        />
                    </div>

                    {onAdd && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAdd}
                            className="bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-neon-blue/30"
                        >
                            <Plus className="w-5 h-5" /> Tambah
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-400">
                            {columns.map((col, idx) => (
                                <th key={idx} className="p-4 font-medium">{col.header}</th>
                            ))}
                            {(onEdit || onDelete) && <th className="p-4 font-medium text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {currentData.length > 0 ? (
                            currentData.map((item, rowIdx) => (
                                <motion.tr
                                    key={rowIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: rowIdx * 0.05 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-4 text-white">
                                            {col.render ? col.render(item) : item[col.accessor]}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="p-4 flex justify-end gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="p-8 text-center text-gray-500">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 border-t border-white/10 pt-4">
                    <span className="text-sm text-gray-400">
                        Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-white/10 text-white disabled:opacity-30 hover:bg-white/5"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-4 py-2 bg-white/5 rounded-lg text-white font-bold">{currentPage}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-white/10 text-white disabled:opacity-30 hover:bg-white/5"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
