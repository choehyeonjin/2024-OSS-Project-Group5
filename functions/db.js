const admin = require("firebase-admin");

// Firebase Admin SDK 초기화
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = firestore;
