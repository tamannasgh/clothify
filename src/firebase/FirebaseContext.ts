import type { UserCredential } from "firebase/auth";
import { createContext } from "react";

type FirebaseContextType = {
	signupWithEmail: (
		email: string,
		password: string
	) => Promise<UserCredential>;
	loginWithEmail: (
		email: string,
		password: string
	) => Promise<UserCredential>;
	continueWithGoogle: () => Promise<UserCredential>;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export default FirebaseContext;
