import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCznfCpBIL78rzT1U8tnSapB_I0JhhLDAE",
  authDomain: "futlink-8b344.firebaseapp.com",
  projectId: "futlink-8b344",
  storageBucket: "futlink-8b344.firebasestorage.app",
  messagingSenderId: "371122333458",
  appId: "1:371122333458:web:11c1387faab9f04471f5cb",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
