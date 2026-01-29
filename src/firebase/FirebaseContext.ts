import type { UserCredential } from "firebase/auth";
import type { DocumentSnapshot } from "firebase/firestore";
import { createContext } from "react";

type FirebaseContextType = {
	signupWithEmail: (
		email: string,
		password: string,
	) => Promise<UserCredential>;
	loginWithEmail: (
		email: string,
		password: string,
	) => Promise<UserCredential>;
	continueWithGoogle: () => Promise<UserCredential>;
	logout: () => Promise<void>;
	setUserDoc: (data: {
		uid: string;
		name: string;
		email: string;
		photoUrl: string;
	}) => Promise<void>;
	getUserDoc: (uid: string) => Promise<DocumentSnapshot>;
	addSellerRole: (uid: string) => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export default FirebaseContext;
