import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = path.resolve(process.env.FIREBASE_CONFIG_PATH!);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const fcm = admin.messaging();
