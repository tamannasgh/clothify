import type { ReactNode } from "react";
import FirebaseContext from "./FirebaseContext";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

function FirebaseProvider({ children }: { children: ReactNode }) {
	function signupWithEmail(email: string, password: string) {
		return createUserWithEmailAndPassword(auth, email, password);
	}

	function loginWithEmail(email: string, password: string) {
		return signInWithEmailAndPassword(auth, email, password);
	}

	function continueWithGoogle() {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	}

	function logout() {
		return signOut(auth);
	}

	function setUserDoc(data: {
		uid: string;
		name: string;
		email: string;
		photoUrl: string;
	}) {
		const userDocRef = doc(db, "users", data.uid);
		return setDoc(userDocRef, {
			name: data.name,
			email: data.email,
			roles: ["user"],
			photoUrl: data.photoUrl,
			createdAt: new Date(),
		});
	}

	async function getUserDoc(uid: string) {
		const docRef = doc(db, "users", uid);
		const userSnapshot = await getDoc(docRef);
		return userSnapshot;
	}

	return (
		<FirebaseContext.Provider
			value={{
				signupWithEmail,
				loginWithEmail,
				continueWithGoogle,
				logout,
				setUserDoc,
				getUserDoc,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
}

export default FirebaseProvider;
