'use client';

import { useEffect, useState } from 'react';
import { itemsApi } from '@/lib/api/items';

export default function StockAlertsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLowStockItems();
    }, []);

    const loadLowStockItems = async () => {
        try {
            const data = await itemsApi.getLowStock();
            setItems(data);
        } catch (error) {
            console.error('Failed to load low stock items:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Stock Alerts</h1>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md font-semibold">
                    {items.length} Alert{items.length !== 1 ? 's' : ''}
                </span>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-12 text-center">
                    <div className="text-green-600 text-6xl mb-4">✓</div>
                    <p className="text-gray-700 text-lg font-semibold">All stock levels are healthy!</p>
                    <p className="text-gray-500 mt-2">No items below minimum stock threshold.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 bg-yellow-50 border-b border-yellow-200">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">⚠️</span>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Low Stock Items</h3>
                                <p className="text-sm text-gray-600">These items are at or below their minimum stock level</p>
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minimum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shortage</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-yellow-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.ref}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.minStock}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                        {item.minStock - item.quantity > 0 ? `Need ${item.minStock - item.quantity}` : 'At minimum'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
