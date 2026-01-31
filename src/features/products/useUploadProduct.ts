import useFirebase from "@/firebase/useFirebase";
import useAuth from "@/providers/auth/useAuth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";

function useUploadProduct() {
	const firebase = useFirebase();
	const { firebaseUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function createProduct(data: {
		name: string;
		des: string;
		price: number;
		images: File[];
	}) {
		try {
			setLoading(true);
			setError(null);
			if (!firebaseUser) {
				throw new FirebaseError("auth", "Login required");
			}

			await firebase.createProduct({
				...data,
				sellerId: firebaseUser.uid,
			});
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

	return { loading, error, createProduct };
}

export default useUploadProduct;
