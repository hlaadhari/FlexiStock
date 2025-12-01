'use client';

export default function ApprovalsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
            </div>

            <div className="bg-white shadow rounded-lg p-12 text-center">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <p className="text-gray-700 text-lg font-semibold">Approval Workflow</p>
                <p className="text-gray-500 mt-2">Review and approve pending requests with multi-level hierarchy.</p>
                <p className="text-sm text-gray-400 mt-4">Feature coming soon - Backend endpoints ready</p>
            </div>
        </div>
    );
}
