import useFirebase from "@/firebase/useFirebase";
import useAuth from "@/providers/auth/useAuth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useNavigate } from "react-router";

function useBecomeSeller() {
	const firebase = useFirebase();
	const { firebaseUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);
	const navigate = useNavigate();

	async function becomeSeller() {
		try {
			setLoading(true);
			const uid = firebaseUser?.uid ?? "";
			await firebase.becomeSeller(uid);
			navigate("/seller/products");
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
	return { becomeSeller, loading, error };
}

export default useBecomeSeller;
