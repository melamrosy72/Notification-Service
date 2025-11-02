"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationLogs = exports.devices = exports.notificationStatusEnum = exports.platformEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.platformEnum = (0, pg_core_1.pgEnum)("platform", ["ios", "android", "web"]);
exports.notificationStatusEnum = (0, pg_core_1.pgEnum)("notification_status", [
    "queued",
    "sending",
    "sent",
    "failed",
]);
exports.devices = (0, pg_core_1.pgTable)("devices", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    deviceId: (0, pg_core_1.varchar)("device_id").notNull().unique(),
    token: (0, pg_core_1.text)("token"),
    platform: (0, exports.platformEnum)("platform").notNull(),
    model: (0, pg_core_1.text)("model"),
    brand: (0, pg_core_1.text)("brand"),
    version: (0, pg_core_1.text)("version"),
    registeredAt: (0, pg_core_1.timestamp)("registered_at").defaultNow().notNull(),
});
exports.notificationLogs = (0, pg_core_1.pgTable)("notification_logs", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    deviceId: (0, pg_core_1.varchar)("device_id").references(() => exports.devices.deviceId, {
        onDelete: "set null",
    }),
    title: (0, pg_core_1.varchar)("title").notNull(),
    body: (0, pg_core_1.text)("body").notNull(),
    data: (0, pg_core_1.json)("data"),
    status: (0, exports.notificationStatusEnum)("notification_status").default("queued").notNull(),
    messageId: (0, pg_core_1.varchar)("message_id"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
