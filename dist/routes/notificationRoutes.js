"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deviceController_1 = require("../controllers/deviceController");
const router = express_1.default.Router();
router.post("/register-token", deviceController_1.registerDeviceHandler);
router.post("/send-notification", deviceController_1.sendNotificationHandler);
router.post("/send-notification-all", deviceController_1.sendToAllHandler);
router.get("/devices", deviceController_1.allDevicesHandler);
router.patch("/remove-token/:deviceId", deviceController_1.removeTokenHandler);
exports.default = router;
