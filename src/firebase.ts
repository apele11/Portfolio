// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics is deliberately loaded off the critical path — it pulls in a large
// module and fires its own requests, neither of which should delay first paint.
if (import.meta.env.PROD) {
  const loadAnalytics = () => {
    void import("firebase/analytics")
      .then(({ getAnalytics, isSupported }) =>
        isSupported().then((supported) => {
          if (supported) getAnalytics(app);
        })
      )
      .catch(() => {
        /* analytics is best-effort; never let it break the page */
      });
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(loadAnalytics, { timeout: 5000 });
  } else {
    setTimeout(loadAnalytics, 3000);
  }
}