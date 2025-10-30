import { eq } from "drizzle-orm";
import { devices, platformEnum } from "../db/schema";
import { db } from "../db";

type DeviceInfo = {
  platform: (typeof platformEnum.enumValues)[number];
  model?: string;
  brand?: string;
  version?: string;
};

export const DeviceService = {
  async registerDevice(
    deviceId: string,
    token: string,
    deviceInfo: DeviceInfo
  ) {
    // check if device already exists
    const existing = await db.query.devices.findFirst({
      where: eq(devices.deviceId, deviceId),
    });

    if (!existing) {
      // insert new device if it doesn't exist
      await db.insert(devices).values({
        deviceId,
        token,
        platform: deviceInfo.platform,
        model: deviceInfo.model,
        brand: deviceInfo.brand,
        version: deviceInfo.version,
      });
    } else {
      // update token if device already exists
      await db
        .update(devices)
        .set({
          token: token,
        })
        .where(eq(devices.deviceId, deviceId));
    }

    return {
      success: true,
      message: "Device token registered successfully",
      deviceId,
    };
  },

  async getTokenByDeviceId(deviceId: string) {
    const found = await db.query.devices.findFirst({
      where: eq(devices.deviceId, deviceId),
    });
    return found?.token ?? null;
  },

  async getAllTokens() {
    const rows = await db.query.devices.findMany();
    return rows.map((r) => r.token).filter(Boolean) as string[];
  },

  async getAllDevices() {
    const rows = await db.query.devices.findMany();
    return rows.map((r) => ({
      deviceId: r.deviceId!,
      token: r.token!,
      platform: r.platform as "android" | "ios" | "web",
      model: r.model!,
      brand: r.brand!,
      version: r.version!,
      registeredAt: r.registeredAt!,
    }));
  },

  async removeDeviceToken(deviceId: string) {
    await db
      .update(devices)
      .set({ token: "" })
      .where(eq(devices.deviceId, deviceId));
    return {
      success: true,
      message: "Device token removed successfully",
    } as const;
  },
};
