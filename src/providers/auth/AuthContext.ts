import type { User } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";
import { createContext } from "react";

type AuthContextType = {
	firebaseUser: User | null;
	user: DocumentData | null;
	loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
