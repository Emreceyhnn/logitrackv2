"use client";

import { useState } from "react";
import {
    createCompany,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getCompanyUsers,
    getCompanyWarehouses,
    getCompanyVehicles,
    getCompanyDrivers,
    getCompanyCustomers,
    addCompanyUser,
    removeCompanyUser,
    getCompanyStats,
} from "@/app/lib/controllers/company";
import { RegisterUser } from "@/app/lib/controllers/users";

const AVAILABLE_ROLES = ["role_admin", "role_manager", "role_dispatcher", "role_driver", "role_warehouse"];

export default function CompanyTestPage() {
    const [userId, setUserId] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [targetUserId, setTargetUserId] = useState("");
    const [name, setName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [selectedRole, setSelectedRole] = useState("DISPATCHER");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAction = async (actionName: string, actionFn: () => Promise<any>) => {
        setLoading(true);
        setResult(null);
        try {
            console.log(`Calling ${actionName}...`);
            const data = await actionFn();
            console.log(`${actionName} success:`, data);

            // Auto-fill result if success
            if (actionName === "createCompany" && data?.company?.id) {
                setCompanyId(data.company.id);
            }
            if (actionName === "createTestUser" && data?.user?.id) {
                setUserId(data.user.id);
                console.log("Auto-filled User ID:", data.user.id);
            }

            setResult({ action: actionName, success: true, data });
        } catch (error: any) {
            console.error(`${actionName} error:`, error);
            setResult({ action: actionName, success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const createRandomUser = async () => {
        const randomId = Math.floor(Math.random() * 10000);
        const username = `testuser${randomId}`;
        const email = `test${randomId}@example.com`;
        const password = "password123";
        const fullName = `Test User ${randomId}`;

        // RegisterUser(username, name, surname, password, email)
        return await RegisterUser(username, fullName, "Tester", password, email);
    };

    const generateMockDriverData = () => {
        const randomId = Math.floor(Math.random() * 10000);
        return {
            employeeId: `EMP-${randomId}`,
            phone: `+1555${randomId.toString().padStart(6, '0')}`,
            licenseNumber: `LIC-${randomId}`,
            licenseType: ["Class A", "Class B", "Class C"][Math.floor(Math.random() * 3)],
            // expiry 1-5 years in future
            licenseExpiry: new Date(Date.now() + 31536000000 * (1 + Math.floor(Math.random() * 4))),
            safetyScore: 80 + Math.floor(Math.random() * 20),
            efficiencyScore: 70 + Math.floor(Math.random() * 30),
            status: "OFF_DUTY" // Default status
        };
    };

    return (
        <div className="p-10 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Company Controller Playground</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
                <h2 className="text-xl font-semibold">Inputs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User ID (Acting User)</label>
                        <div className="flex gap-2">
                            <input
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="e.g. cm1..."
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded border border-gray-300 whitespace-nowrap"
                                onClick={() => handleAction("createTestUser", createRandomUser)}
                                disabled={loading}
                            >
                                Create User
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">If you don't have a valid ID, use "Create User".</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company ID</label>
                        <input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="e.g. cm2..."
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Unique Company Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                        <input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="https://..."
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target User</label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="For Add/Remove User"
                                    value={targetUserId}
                                    onChange={(e) => setTargetUserId(e.target.value)}
                                />
                                <button
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded border border-gray-300 whitespace-nowrap"
                                    onClick={() => handleAction("createTargetUser", async () => {
                                        const data = await createRandomUser();
                                        if (data?.user?.id) setTargetUserId(data.user.id);
                                        return data;
                                    })}
                                    disabled={loading}
                                >
                                    Create Target
                                </button>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Role for New User</label>
                                <select
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    {AVAILABLE_ROLES.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
                <h2 className="text-xl font-semibold">Actions</h2>

                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="w-full font-medium text-gray-500">CRUD Operations</span>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("createCompany", () => createCompany(userId, name, avatarUrl))}
                            disabled={loading}
                        >
                            Create Company (Auto Assign ADMIN)
                        </button>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("getCompanyById", () => getCompanyById(companyId, userId))}
                            disabled={loading}
                        >
                            Get Company
                        </button>
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("updateCompany", () => updateCompany(companyId, userId, { name, avatarUrl }))}
                            disabled={loading}
                        >
                            Update Company
                        </button>
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("deleteCompany", () => deleteCompany(companyId, userId))}
                            disabled={loading}
                        >
                            Delete Company
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="w-full font-medium text-gray-500">User Management</span>
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("getCompanyUsers", () => getCompanyUsers(companyId, userId))}
                            disabled={loading}
                        >
                            Get Users
                        </button>
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                            onClick={() => {
                                const driverData = selectedRole === "role_driver" ? generateMockDriverData() : {};
                                handleAction("addCompanyUser", () => addCompanyUser(companyId, userId, targetUserId, selectedRole, driverData));
                            }}
                            disabled={loading}
                        >
                            Add User ({selectedRole})
                        </button>
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("removeCompanyUser", () => removeCompanyUser(companyId, userId, targetUserId))}
                            disabled={loading}
                        >
                            Remove User
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="w-full font-medium text-gray-500">Related Data</span>
                        <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("getCompanyStats", () => getCompanyStats(companyId, userId))}
                            disabled={loading}
                        >
                            Get Stats
                        </button>
                        <button
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("getCompanyWarehouses", () => getCompanyWarehouses(companyId, userId))}
                            disabled={loading}
                        >
                            Get Warehouses
                        </button>
                        <button
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("getCompanyVehicles", () => getCompanyVehicles(companyId, userId))}
                            disabled={loading}
                        >
                            Get Vehicles
                        </button>
                        <button
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("getCompanyDrivers", () => getCompanyDrivers(companyId, userId))}
                            disabled={loading}
                        >
                            Get Drivers
                        </button>
                        <button
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                            onClick={() => handleAction("getCompanyCustomers", () => getCompanyCustomers(companyId, userId))}
                            disabled={loading}
                        >
                            Get Customers
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 text-green-400 p-6 rounded-lg shadow-md border min-h-[300px] overflow-auto font-mono text-sm">
                <h2 className="text-white text-xl font-semibold mb-2">Console Output</h2>
                {loading ? (
                    <div className="animate-pulse">Loading...</div>
                ) : result ? (
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                ) : (
                    <div className="text-gray-500">Waiting for action...</div>
                )}
            </div>
        </div>
    );
}
