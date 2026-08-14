import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// Deliberately kept out of src/firebase.ts. That module is imported by main.tsx,
// so anything it pulls in lands in the entry chunk that every visitor downloads.
// `firebase/auth` is only ever needed by the dev-only admin panel, and importing
// it from here keeps it inside the lazily-loaded Admin chunk instead.
export const auth = getAuth(app);
