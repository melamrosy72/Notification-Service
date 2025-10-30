import { relations } from "drizzle-orm";
import {
  boolean,
  json,
  PgColumn,
  pgEnum,
  pgTable,
  PgTableWithColumns,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const platformEnum = pgEnum("platform", ["ios", "android", "web"]);
export const notificationStatusEnum = pgEnum("notification_status", [
  "queued",
  "sending",
  "sent",
  "failed",
]);

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").notNull().unique(),
  token: text("token").notNull(),
  platform: platformEnum("platform").notNull(),
  model: text("model"),
  brand: text("brand"),
  version: text("version"),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

export const notificationLogs = pgTable("notification_logs", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id").references(() => devices.deviceId, {
    onDelete: "set null",
  }),
  title: varchar("title").notNull(),
  body: text("body").notNull(),
  data: json("data"),
  status: notificationStatusEnum("notification_status").default("queued").notNull(),
  messageId: varchar("message_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
