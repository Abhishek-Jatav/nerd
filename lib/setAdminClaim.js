// setAdminClaim.js
const admin = require("firebase-admin");

// Initialize app with your service account key
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

// Set admin claim
async function setAdmin(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Set admin claim for ${email}`);
}

// Add your admin emails here:
const adminEmails = ["abhidel44@gmail.com", "abhishekofficial8285@gmail.com"];

Promise.all(adminEmails.map(setAdmin)).then(() => {
  console.log("All done.");
  process.exit();
});
