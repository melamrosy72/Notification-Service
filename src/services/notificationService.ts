import { fcm } from "../firebase/firebase";
import { DeviceService } from "./deviceService";

export const NotificationService = {
    async sendToDeviceId(deviceId: string, title: string, body: string, data?: Record<string, any>) {
        const token = await DeviceService.getTokenByDeviceId(deviceId);
        if (!token) {
            return { success: false, message: "Device not Registered" } as const;
        }

        const response = await fcm.send({
            token,
            notification: { title, body },
            data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
        });

        return { success: true, message: "Notification sent successfully", messageId: response } as const;
    },

    async sendToAll(title: string, body: string, data?: Record<string, any>) {
        const tokens = await DeviceService.getAllTokens();
        if (!tokens.length) {
            return { success: true, successCount: 0, failureCount: 0, totalDevices: 0 } as const;
        }

        const response = await fcm.sendEachForMulticast({
            tokens,
            notification: { title, body },
            data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
        });

        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
            totalDevices: tokens.length,
        } as const;
    },
};
