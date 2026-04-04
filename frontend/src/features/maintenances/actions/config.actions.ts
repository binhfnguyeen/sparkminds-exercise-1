'use server';
import {getToken} from "@/features/auth/actions/auth.action";
import { configService } from "../services/config.service";

export async function getSystemConfigAction() {
    const token = await getToken();
    if (!token) throw new Error("Chưa xác thực");
    return configService.getConfig(token);
}

export async function toggleMaintenanceAction(enabled: boolean) {
    const token = await getToken();
    if (!token) throw new Error("Chưa xác thực");
    return configService.toggleMaintenance(token, enabled);
}