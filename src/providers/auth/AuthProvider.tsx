import { useEffect, useState, type ReactNode } from "react";
import AuthContext from "@/providers/auth/AuthContext";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";

function AuthProvider({ children }: { children: ReactNode }) {
	const [firebaseUser, setfirebaseUser] = useState<User | null>(null);
	const [user, setUser] = useState<DocumentData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setfirebaseUser(firebaseUser);
			if (!firebaseUser) {
				setUser(null);
				setLoading(false);
			}
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		if (!firebaseUser) return;
		const unsubscribe = onSnapshot(
			doc(db, "users", firebaseUser.uid),
			(userData) => {
				setUser(userData.data() ?? null);
				setLoading(false);
			},
		);
		return unsubscribe;
	}, [firebaseUser]);

	return (
		<AuthContext.Provider value={{ user, firebaseUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;
