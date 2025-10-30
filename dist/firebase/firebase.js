"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcm = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccountPath = path_1.default.resolve(process.env.FIREBASE_CONFIG_PATH);
const serviceAccount = JSON.parse((0, fs_1.readFileSync)(serviceAccountPath, "utf8"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
exports.fcm = firebase_admin_1.default.messaging();
