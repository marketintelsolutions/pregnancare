const admin = require('firebase-admin');
const serviceAccount = require('../firebaseKey.json'); // Replace with path to your key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db