"use client";

import { useState } from "react";
import {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    assignDriverToVehicle,
    updateVehicleStatus,
    addMaintenanceRecord
} from "@/app/lib/controllers/vehicle";
import { createCompany } from "@/app/lib/controllers/company";
import { RegisterUser } from "@/app/lib/controllers/users";

export default function VehicleTestPage() {
    // Context States
    const [userId, setUserId] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [driverId, setDriverId] = useState("");

    // Form States
    const [fleetNo, setFleetNo] = useState("FL-001");
    const [plate, setPlate] = useState("34 AB 123");
    const [brand, setBrand] = useState("Mercedes");
    const [model, setModel] = useState("Actros");
    const [year, setYear] = useState(2023);
    const [type, setType] = useState("TRUCK");
    const [maxLoadKg, setMaxLoadKg] = useState(20000);
    const [fuelType, setFuelType] = useState("DIESEL");

    const [maintenanceDesc, setMaintenanceDesc] = useState("Routine Check");
    const [maintenanceCost, setMaintenanceCost] = useState(500);

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAction = async (actionName: string, actionFn: () => Promise<any>) => {
        setLoading(true);
        setResult(null);
        try {
            console.log(`Calling ${actionName}...`);
            const data = await actionFn();
            console.log(`${actionName} success:`, data);

            // Auto-fill useful IDs
            if (actionName === "createVehicle" && data?.id) {
                setVehicleId(data.id);
            }
            if (actionName === "setupTestEnv") {
                if (data.user?.id) setUserId(data.user.id);
                if (data.company?.id) setCompanyId(data.company.id);
            }

            setResult({ action: actionName, success: true, data });
        } catch (error: any) {
            console.error(`${actionName} error:`, error);
            setResult({ action: actionName, success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const setupTestEnv = async () => {
        // 1. Create Admin User
        const randomId = Math.floor(Math.random() * 10000);
        const user = await RegisterUser(
            `admin${randomId}`,
            `Admin ${randomId}`,
            "User",
            "password123",
            `admin${randomId}@test.com`
        );

        let company;
        if (user?.user?.id) {
            // 2. Create Company (assigns role_admin to user implicitly in controller [previous turn])
            // Actually previous createCompany assigns "role_admin".
            company = await createCompany(user.user.id, `LogiTrans ${randomId}`, "https://via.placeholder.com/150");
        }

        return { user: user.user, company: company?.company };
    };

    const generateRandomPlate = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
        return `34 ${randomLetter()}${randomLetter()} ${Math.floor(Math.random() * 900 + 100)}`;
    };

    return (
        <div className="p-10 space-y-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Vehicle Controller Playground</h1>

            {/* SETUP SECTION */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">1. Quick Setup</h2>
                <div className="flex gap-4 items-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                        onClick={() => handleAction("setupTestEnv", setupTestEnv)}
                        disabled={loading}
                    >
                        Create Admin & Company
                    </button>
                    <div className="text-sm text-gray-600">
                        Creates a fresh Admin User and Company to allow vehicle operations.
                    </div>
                </div>
            </div>

            {/* CONTEXT INPUTS */}
            <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
                <h2 className="text-xl font-semibold">2. Context</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User ID (Admin/Manager)</label>
                        <input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="User ID required"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company ID</label>
                        <input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            placeholder="Company ID required"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Target Vehicle ID</label>
                        <input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            placeholder="For Get/Update/Delete"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Driver ID (For Assign)</label>
                        <input
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={driverId}
                            onChange={(e) => setDriverId(e.target.value)}
                            placeholder="Driver ID"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CREATE VEHICLE FORM */}
                <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
                    <h2 className="text-xl font-semibold">3. Create Vehicle</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500">Fleet No</label>
                            <div className="flex gap-1">
                                <input className="border p-1 w-full rounded" value={fleetNo} onChange={e => setFleetNo(e.target.value)} />
                                <button className="text-xs bg-gray-200 px-2 rounded" onClick={() => setFleetNo(`FL-${Math.floor(Math.random() * 1000)}`)}>Rnd</button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Plate</label>
                            <div className="flex gap-1">
                                <input className="border p-1 w-full rounded" value={plate} onChange={e => setPlate(e.target.value)} />
                                <button className="text-xs bg-gray-200 px-2 rounded" onClick={() => setPlate(generateRandomPlate())}>Rnd</button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Brand</label>
                            <input className="border p-1 w-full rounded" value={brand} onChange={e => setBrand(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Model</label>
                            <input className="border p-1 w-full rounded" value={model} onChange={e => setModel(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Type</label>
                            <select className="border p-1 w-full rounded" value={type} onChange={e => setType(e.target.value)}>
                                <option value="TRUCK">TRUCK</option>
                                <option value="VAN">VAN</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Fuel</label>
                            <select className="border p-1 w-full rounded" value={fuelType} onChange={e => setFuelType(e.target.value)}>
                                <option value="DIESEL">DIESEL</option>
                                <option value="ELECTRIC">ELECTRIC</option>
                                <option value="GASOLINE">GASOLINE</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                        onClick={() => handleAction("createVehicle", () => createVehicle(companyId, userId, {
                            fleetNo, plate, brand, model, year, type, maxLoadKg, fuelType
                        }))}
                        disabled={loading}
                    >
                        Create Vehicle
                    </button>
                </div>

                {/* ACTIONS */}
                <div className="bg-white p-6 rounded-lg shadow-md border space-y-4">
                    <h2 className="text-xl font-semibold">4. Manage Vehicle</h2>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500 border-b pb-1">Basic Operations</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition"
                                onClick={() => handleAction("getVehicles", () => getVehicles(companyId, userId))}
                                disabled={loading}
                            >
                                List All Vehicles
                            </button>
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition"
                                onClick={() => handleAction("getVehicleById", () => getVehicleById(vehicleId, userId))}
                                disabled={loading}
                            >
                                Get Details
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                                onClick={() => handleAction("deleteVehicle", () => deleteVehicle(vehicleId, userId))}
                                disabled={loading}
                            >
                                Delete Vehicle
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500 border-b pb-1">Driver & Status</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
                                onClick={() => handleAction("assignDriver", () => assignDriverToVehicle(vehicleId, driverId || null, userId))}
                                disabled={loading}
                            >
                                Assign Driver ({driverId || "NULL"})
                            </button>
                            <button
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
                                onClick={() => handleAction("setMaintenance", () => updateVehicleStatus(vehicleId, "MAINTENANCE", userId))}
                                disabled={loading}
                            >
                                Set Status: MAINTENANCE
                            </button>
                            <button
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
                                onClick={() => handleAction("setAvailable", () => updateVehicleStatus(vehicleId, "AVAILABLE", userId))}
                                disabled={loading}
                            >
                                Set Status: AVAILABLE
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500 border-b pb-1">Maintenance Log</h3>
                        <div className="flex gap-2 items-center">
                            <input className="border p-1 w-32 rounded text-sm" placeholder="Desc" value={maintenanceDesc} onChange={e => setMaintenanceDesc(e.target.value)} />
                            <input className="border p-1 w-20 rounded text-sm" type="number" placeholder="Cost" value={maintenanceCost} onChange={e => setMaintenanceCost(Number(e.target.value))} />
                            <button
                                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition"
                                onClick={() => handleAction("addMaintenance", () => addMaintenanceRecord(vehicleId, userId, {
                                    type: "Repair",
                                    date: new Date(),
                                    cost: maintenanceCost,
                                    description: maintenanceDesc
                                }))}
                                disabled={loading}
                            >
                                Add Log
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONSOLE */}
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
