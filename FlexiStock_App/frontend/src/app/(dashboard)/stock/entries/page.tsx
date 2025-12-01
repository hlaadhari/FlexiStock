'use client';

import { useEffect, useState } from 'react';
import { stockApi } from '@/lib/api/categories';

export default function StockEntriesPage() {
    const [movements, setMovements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMovements();
    }, []);

    const loadMovements = async () => {
        try {
            const data = await stockApi.getMovements();
            const entries = data.filter((m: any) => m.type === 'IN');
            setMovements(entries);
        } catch (error) {
            console.error('Failed to load movements:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Stock Entries</h1>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    New Entry
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : movements.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-12 text-center">
                    <p className="text-gray-500">No stock entries found.</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {movements.map((movement) => (
                                <tr key={movement.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(movement.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {movement.item?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                        +{movement.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {movement.user?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{movement.reason || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
