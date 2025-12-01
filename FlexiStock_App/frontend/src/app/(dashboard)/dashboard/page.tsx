'use client';

import { useEffect, useState } from 'react';
import { itemsApi } from '@/lib/api/items';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockCount: 0,
        pendingRequests: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const items = await itemsApi.getAll();
            const lowStock = await itemsApi.getLowStock();

            setStats({
                totalItems: items.length,
                lowStockCount: lowStock.length,
                pendingRequests: 0, // TODO: Implement requests API
            });
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="text-4xl">📦</span>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Total Items
                                            </dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.totalItems}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="text-4xl">⚠️</span>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Low Stock Alerts
                                            </dt>
                                            <dd className="text-3xl font-semibold text-yellow-600">{stats.lowStockCount}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="text-4xl">📋</span>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Pending Requests
                                            </dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.pendingRequests}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Welcome to FlexiStock!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Your comprehensive stock management system is ready. Here's what you can do:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-l-4 border-indigo-600 pl-4">
                                <h4 className="font-semibold text-gray-900">✅ Implemented Features</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    <li>• Item management with CRUD operations</li>
                                    <li>• Category hierarchy management</li>
                                    <li>• Stock movements (IN/OUT/AUDIT)</li>
                                    <li>• Low stock alerts and monitoring</li>
                                    <li>• Role-based access control</li>
                                </ul>
                            </div>
                            <div className="border-l-4 border-yellow-600 pl-4">
                                <h4 className="font-semibold text-gray-900">🚧 Coming Soon</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    <li>• Request & approval workflows</li>
                                    <li>• Barcode scanning (PWA)</li>
                                    <li>• Offline sync capabilities</li>
                                    <li>• Advanced reporting & exports</li>
                                    <li>• Email notifications</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
