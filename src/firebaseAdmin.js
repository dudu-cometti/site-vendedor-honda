const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json"); // Caminho correto para o seu arquivo

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://site-vendedor-honda-default-rtdb.firebaseio.com/" // Substitua pelo seu URL
});

module.exports = admin;

