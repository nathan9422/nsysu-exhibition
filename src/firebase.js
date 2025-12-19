import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ 請將這裡換成你自己的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyAbJHFJUxrxxRPmDwpkibjrCkKgevEYGL0",
  authDomain: "myexhibititionwall.firebaseapp.com",
  projectId: "myexhibititionwall",
  storageBucket: "myexhibititionwall.firebasestorage.app",
  messagingSenderId: "1062611841042",
  appId: "1:1062611841042:web:6dc0da6c977150507368cb",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
