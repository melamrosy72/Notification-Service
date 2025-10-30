"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const db_1 = require("../db");
exports.DeviceService = {
    async registerDevice(deviceId, token, deviceInfo) {
        // check if device already exists
        const existing = await db_1.db.query.devices.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.devices.deviceId, deviceId),
        });
        if (!existing) {
            // insert new device if it doesn't exist
            await db_1.db.insert(schema_1.devices).values({
                deviceId,
                token,
                platform: deviceInfo.platform,
                model: deviceInfo.model,
                brand: deviceInfo.brand,
                version: deviceInfo.version,
            });
        }
        else {
            // update token if device already exists
            await db_1.db
                .update(schema_1.devices)
                .set({
                token: token,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.devices.deviceId, deviceId));
        }
        return {
            success: true,
            message: "Device token registered successfully",
            deviceId,
        };
    },
    async getTokenByDeviceId(deviceId) {
        const found = await db_1.db.query.devices.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.devices.deviceId, deviceId),
        });
        return found?.token ?? null;
    },
    async getAllTokens() {
        const rows = await db_1.db.query.devices.findMany();
        return rows.map((r) => r.token).filter(Boolean);
    },
    async getAllDevices() {
        const rows = await db_1.db.query.devices.findMany();
        return rows.map((r) => ({
            deviceId: r.deviceId,
            token: r.token,
            platform: r.platform,
            model: r.model,
            brand: r.brand,
            version: r.version,
            registeredAt: r.registeredAt,
        }));
    },
    async removeDevice(deviceId) {
        await db_1.db
            .update(schema_1.devices)
            .set({ token: "" })
            .where((0, drizzle_orm_1.eq)(schema_1.devices.deviceId, deviceId));
        return {
            success: true,
            message: "Device token removed successfully",
        };
    },
};
