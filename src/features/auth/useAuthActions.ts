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
			if (e instanceof FirebaseError) {
				setError(e);
			} else {
				setError(
					new FirebaseError("unknown", "Unknown error occurred"),
				);
			}
		} finally {
			setLoading(false);
		}
	}

	function signupWithEmail(email: string, password: string) {
		return runAuthAction(() => firebase.signupWithEmail(email, password));
	}

	function loginWithEmail(email: string, password: string) {
		return runAuthAction(() => firebase.loginWithEmail(email, password));
	}

	function continueWithGoogle() {
		return runAuthAction(() => firebase.continueWithGoogle());
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
