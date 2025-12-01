'use client';

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

            <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Low Stock Alert Threshold
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Default: 10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Auto-refresh Interval (seconds)
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Default: 300"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                    <div className="space-y-3">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm text-gray-700">Email notifications for low stock</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm text-gray-700">Email notifications for pending approvals</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-700">Daily summary reports</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
                    <dl className="space-y-2">
                        <div className="flex justify-between">
                            <dt className="text-sm text-gray-500">Version</dt>
                            <dd className="text-sm font-medium text-gray-900">1.0.0</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-gray-500">Database</dt>
                            <dd className="text-sm font-medium text-gray-900">PostgreSQL</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-gray-500">Cache</dt>
                            <dd className="text-sm font-medium text-gray-900">Redis</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
