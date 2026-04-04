'use client';

import {MaintenanceConfigForm} from "@/features/maintenances/components/MaintenanceConfigForm";

export default function MaintenancesPage () {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Cài đặt Hệ thống</h1>

            <MaintenanceConfigForm />

        </div>
    )
}