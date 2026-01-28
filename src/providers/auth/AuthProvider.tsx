import { useEffect, useState, type ReactNode } from "react";
import AuthContext from "@/providers/auth/AuthContext";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import type { DocumentData } from "firebase/firestore";
import useFirebase from "@/firebase/useFirebase";

function AuthProvider({ children }: { children: ReactNode }) {
	const { getUserDoc } = useFirebase();
	const [firebaseUser, setfirebaseUser] = useState<User | null>(null);
	const [user, setUser] = useState<DocumentData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setfirebaseUser(firebaseUser);
			if (firebaseUser) {
				const userData = await getUserDoc(firebaseUser?.uid);
				setUser(userData.data() ?? null);
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider value={{ user, firebaseUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;
