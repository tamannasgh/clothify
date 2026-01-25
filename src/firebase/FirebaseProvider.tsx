import type { ReactNode } from "react";
import FirebaseContext from "./FirebaseContext";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { auth } from "./firebase";

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
	return (
		<FirebaseContext.Provider
			value={{
				signupWithEmail,
				loginWithEmail,
				continueWithGoogle,
				logout,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
}

export default FirebaseProvider;
