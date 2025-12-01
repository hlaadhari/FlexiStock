'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Items', href: '/items', icon: '📦' },
        { name: 'Categories', href: '/categories', icon: '🏷️' },
        { name: 'Stock Entries', href: '/stock/entries', icon: '📥' },
        { name: 'Stock Exits', href: '/stock/exits', icon: '📤' },
        { name: 'Alerts', href: '/stock/alerts', icon: '⚠️' },
        { name: 'Requests', href: '/requests', icon: '📋' },
        { name: 'Approvals', href: '/approvals', icon: '✅' },
        { name: 'Users', href: '/users', icon: '👥' },
        { name: 'Settings', href: '/settings', icon: '⚙️' },
    ];

    return (
        <div className="flex flex-col w-64 bg-white shadow-lg">
            <div className="flex items-center justify-center h-16 border-b">
                <h1 className="text-2xl font-bold text-indigo-600">FlexiStock</h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                }`}
                        >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
