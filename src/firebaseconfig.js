// src/firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAE9l0tDBrnkIhVwLLMH09r3_PLC76GzDs",
  authDomain: "site-vendedor-honda.firebaseapp.com",
  databaseURL: "https://site-vendedor-honda-default-rtdb.firebaseio.com",
  projectId: "site-vendedor-honda",
  storageBucket: "site-vendedor-honda.firebasestorage.app",
  messagingSenderId: "530337788950",
  appId: "1:530337788950:web:fd6ea6154ffbf0acd9f137"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };