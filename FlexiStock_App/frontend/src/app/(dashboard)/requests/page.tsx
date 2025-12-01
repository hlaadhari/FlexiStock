'use client';

export default function RequestsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    New Request
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-12 text-center">
                <div className="text-indigo-600 text-6xl mb-4">📋</div>
                <p className="text-gray-700 text-lg font-semibold">Requests Management</p>
                <p className="text-gray-500 mt-2">Create and track stock requests with approval workflows.</p>
                <p className="text-sm text-gray-400 mt-4">Feature coming soon - Backend endpoints ready</p>
            </div>
        </div>
    );
}
