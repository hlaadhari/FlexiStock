'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
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
    }, [router]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">Stock Management</h2>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                {user.name} <span className="text-gray-500">({user.role})</span>
                            </span>
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
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
