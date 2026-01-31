import useFirebase from "@/firebase/useFirebase";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useNavigate } from "react-router";

function useAuthActions() {
	const firebase = useFirebase();
	const navigate = useNavigate();
	const [error, setError] = useState<FirebaseError | null>(null);
	const [loading, setLoading] = useState(false);

	async function runAuthAction(action: () => Promise<unknown>) {
		try {
			setError(null);
			setLoading(true);
			await action();
			navigate("/products");
		} catch (e) {
			console.log("there was some error");
			const err =
				e instanceof FirebaseError
					? e
					: new FirebaseError("unknown", "Unknown error occurred");

			setError(err);
			throw err;
		} finally {
			setLoading(false);
		}
	}

	function signupWithEmail(name: string, email: string, password: string) {
		return runAuthAction(async () => {
			const { user } = await firebase.signupWithEmail(email, password);
			return firebase.setUserDoc({
				uid: user.uid,
				name: user.displayName || name,
				email: user.email || email,
				photoUrl: user.photoURL || "https://shorturl.at/oW8QV",
			});
		});
	}

	function loginWithEmail(email: string, password: string) {
		return runAuthAction(async () => {
			const { user } = await firebase.loginWithEmail(email, password);
			const userData = await firebase.getUserDoc(user.uid);
			if (userData.exists()) {
				return userData.data();
			}
			return firebase.setUserDoc({
				uid: user.uid,
				name: user.displayName || "",
				email: user.email || email,
				photoUrl: user.photoURL || "https://shorturl.at/oW8QV",
			});
		});
	}

	function continueWithGoogle() {
		return runAuthAction(async () => {
			const { user } = await firebase.continueWithGoogle();
			const userData = await firebase.getUserDoc(user.uid);
			if (userData.exists()) {
				return userData.data();
			}
			return firebase.setUserDoc({
				uid: user.uid,
				name: user.displayName || "",
				email: user.email || "",
				photoUrl: user.photoURL || "https://shorturl.at/oW8QV",
			});
		});
	}

	return {
		signupWithEmail,
		loginWithEmail,
		continueWithGoogle,
		error,
		loading,
	};
}

export default useAuthActions;
