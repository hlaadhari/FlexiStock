'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { itemsApi } from '@/lib/api/items';
import { stockApi } from '@/lib/api/categories';

export default function ItemDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [item, setItem] = useState<any>(null);
    const [movements, setMovements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            router.push('/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        loadItem();
    }, [router, params.id]);

    const loadItem = async () => {
        try {
            const itemData = await itemsApi.getById(parseInt(params.id as string));
            setItem(itemData);

            const movementsData = await stockApi.getItemMovements(parseInt(params.id as string));
            setMovements(movementsData);
        } catch (error) {
            console.error('Failed to load item:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user || loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!item) {
        return <div className="flex items-center justify-center min-h-screen">Item not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-indigo-600">FlexiStock</h1>
                            <div className="flex space-x-4">
                                <a href="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                                    Dashboard
                                </a>
                                <a href="/items" className="text-indigo-600 px-3 py-2 text-sm font-medium border-b-2 border-indigo-600">
                                    Items
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">{user.name} ({user.role})</span>
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    router.push('/login');
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Item Details</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => router.push('/items')}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Back
                            </button>
                            {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                                <button
                                    onClick={() => router.push(`/items/${item.id}/edit`)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Reference: {item.ref}</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.category?.name || 'N/A'}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={item.quantity <= item.minStock ? 'text-red-600 font-semibold' : ''}>
                                            {item.quantity}
                                        </span>
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Minimum Stock</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.minStock}</dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.location || 'N/A'}</dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Stock Movements</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            {movements.length === 0 ? (
                                <div className="px-4 py-5 text-center text-gray-500">No movements found</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {movements.map((movement) => (
                                            <tr key={movement.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(movement.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${movement.type === 'IN' ? 'bg-green-100 text-green-800' :
                                                            movement.type === 'OUT' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {movement.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.user?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{movement.reason || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
