import { useContext } from "react";
import FirebaseContext from "./FirebaseContext";

function useFirebase() {
	const ctx = useContext(FirebaseContext);
	if (!ctx) {
		throw new Error(
			"useFirebase must be used only inside FirebaseProvider."
		);
	}
	return ctx;
}

export default useFirebase;
