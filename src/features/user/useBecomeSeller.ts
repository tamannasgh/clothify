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

	async function addSellerRole() {
		try {
			setLoading(true);
			const uid = firebaseUser?.uid ?? "";
			await firebase.addSellerRole(uid);
			navigate("/seller/products");
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
	return { addSellerRole, loading, error };
}

export default useBecomeSeller;
