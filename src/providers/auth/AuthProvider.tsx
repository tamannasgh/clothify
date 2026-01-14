import { useEffect, useState, type ReactNode } from "react";
import AuthContext from "@/providers/auth/AuthContext";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/firebase/firebase";

function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;
