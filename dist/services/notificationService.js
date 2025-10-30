"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const firebase_1 = require("../firebase/firebase");
const deviceService_1 = require("./deviceService");
exports.NotificationService = {
    async sendToDeviceId(deviceId, title, body, data) {
        const token = await deviceService_1.DeviceService.getTokenByDeviceId(deviceId);
        if (!token) {
            return { success: false, message: "Device not Registered" };
        }
        const response = await firebase_1.fcm.send({
            token,
            notification: { title, body },
            data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
        });
        return { success: true, message: "Notification sent successfully", messageId: response };
    },
    async sendToAll(title, body, data) {
        const tokens = await deviceService_1.DeviceService.getAllTokens();
        if (!tokens.length) {
            return { success: true, successCount: 0, failureCount: 0, totalDevices: 0 };
        }
        const response = await firebase_1.fcm.sendEachForMulticast({
            tokens,
            notification: { title, body },
            data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
        });
        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
            totalDevices: tokens.length,
        };
    },
};
