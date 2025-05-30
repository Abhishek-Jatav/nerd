// lib/setAdminClaim.ts
import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import serviceAccountJson from "./serviceAccountKey.json"; // Ensure this is outside the client

const serviceAccount = serviceAccountJson as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function setAdminClaim(uid: string) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for user: ${uid}`);
  } catch (error) {
    console.error("Error setting admin claim:", error);
  }
}
