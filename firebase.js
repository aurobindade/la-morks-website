import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const portfolioCol = collection(db, "portfolio");

export function subscribePortfolio(callback) {
  const q = query(portfolioCol, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addPortfolioItem(item) {
  return addDoc(portfolioCol, { ...item, createdAt: Date.now() });
}

export async function updatePortfolioItem(id, data) {
  return updateDoc(doc(db, "portfolio", id), { ...data });
}

export async function uploadPortfolioImage(file, path) {
  if (!file) throw new Error("No file provided");
  const storage = getStorage();
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  return url;
}

export async function deletePortfolioItem(id) {
  return deleteDoc(doc(db, "portfolio", id));
}

export async function seedPortfolio(items) {
  return Promise.all(
    items.map((item) => addDoc(portfolioCol, { ...item, createdAt: Date.now() }))
  );
}
