import express from "express";
import {
  registerDeviceHandler,
  sendNotificationHandler,
  sendToAllHandler,
  allDevicesHandler,
  removeTokenHandler,
} from "../controllers/deviceController";

const router = express.Router();

router.post("/register-token", registerDeviceHandler);
router.post("/send-notification", sendNotificationHandler);
router.post("/send-notification-all", sendToAllHandler);
router.get("/devices", allDevicesHandler);
router.patch("/remove-token/:deviceId", removeTokenHandler);

export default router;
