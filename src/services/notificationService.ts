import { fcm } from "../firebase/firebase";
import { DeviceService } from "./deviceService";

export const NotificationService = {
    async sendToDeviceId(
        deviceId: string,
        title: string,
        body: string,
        data?: Record<string, any>,
        imageUrl?: string
    ) {
        const token = await DeviceService.getTokenByDeviceId(deviceId);
        if (!token) {
            return { success: false, message: "Device not Registered" } as const;
        }

        // Build the base message
        const message: any = {
            token,
            notification: {
                title,
                body,
                ...(imageUrl && { image: imageUrl })
            },
            data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
        };

        // Add platform-specific configurations for image support
        if (imageUrl) {
            // Android configuration
            message.android = {
                notification: {
                    image: imageUrl
                }
            };

            // iOS configuration
            message.apns = {
                payload: {
                    aps: {
                        'mutable-content': 1
                    }
                },
                fcm_options: {
                    image: imageUrl
                }
            };

            // Web configuration
            message.webpush = {
                headers: {
                    image: imageUrl
                }
            };
        }

        const response = await fcm.send(message);
        return {
            success: true,
            message: "Notification sent successfully",
            messageId: response
        } as const;
    },

    async sendToAll(title: string, body: string, data?: Record<string, any>, imageUrl?: string) {
        const tokens = await DeviceService.getAllTokens();
        if (!tokens.length) {
            return { success: true, successCount: 0, failureCount: 0, totalDevices: 0 } as const;
        }

        // Build the base message
        const message: any = {
            tokens,
            notification: {
                title,
                body,
                ...(imageUrl && { image: imageUrl })
            },
            data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
        };

        // Add platform-specific configurations for image support
        if (imageUrl) {
            // Android configuration
            message.android = {
                notification: {
                    image: imageUrl
                }
            };

            // iOS configuration
            message.apns = {
                payload: {
                    aps: {
                        'mutable-content': 1
                    }
                },
                fcm_options: {
                    image: imageUrl
                }
            };

            // Web configuration
            message.webpush = {
                headers: {
                    image: imageUrl
                }
            };
        }

        const response = await fcm.sendEachForMulticast(message);

        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
            totalDevices: tokens.length,
        } as const;
    }
};
