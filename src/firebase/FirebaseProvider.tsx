import type { ReactNode } from "react";
import FirebaseContext from "./FirebaseContext";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import {
	setDoc,
	doc,
	getDoc,
	updateDoc,
	arrayUnion,
	collection,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function FirebaseProvider({ children }: { children: ReactNode }) {
	function signupWithEmail(email: string, password: string) {
		return createUserWithEmailAndPassword(auth, email, password);
	}

	function loginWithEmail(email: string, password: string) {
		return signInWithEmailAndPassword(auth, email, password);
	}

	function continueWithGoogle() {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	}

	function logout() {
		return signOut(auth);
	}

	function setUserDoc(data: {
		uid: string;
		name: string;
		email: string;
		photoUrl: string;
	}) {
		const userDocRef = doc(db, "users", data.uid);
		return setDoc(userDocRef, {
			name: data.name,
			email: data.email,
			roles: ["user"],
			photoUrl: data.photoUrl,
			createdAt: new Date(),
		});
	}

	async function getUserDoc(uid: string) {
		const docRef = doc(db, "users", uid);
		const userSnapshot = await getDoc(docRef);
		return userSnapshot;
	}

	async function becomeSeller(uid: string) {
		const docRef = doc(db, "users", uid);
		return updateDoc(docRef, {
			roles: arrayUnion("seller"),
		});
	}

	async function createProduct(data: {
		name: string;
		des: string;
		price: number;
		images: File[];
		sellerId: string;
	}) {
		const productColRef = collection(db, "products");
		const EmptyProductDocRef = doc(productColRef);
		const productId = EmptyProductDocRef.id;

		//async doen't work in forEach
		const imagesUrl: { downloadUrl: string; imagePath: string }[] =
			await Promise.all(
				data.images.map((image) =>
					uploadFileAndGetUrl(
						image,
						`products/${data.sellerId}/${productId}/${Date.now()}-${image.name}`,
					),
				),
			);

		return setDoc(EmptyProductDocRef, {
			name: data.name,
			des: data.des,
			price: data.price,
			images: imagesUrl,
			sellerId: data.sellerId,
			createdAt: new Date(),
		});
	}

	async function uploadFileAndGetUrl(image: File, imagePath: string) {
		const imgRef = ref(storage, imagePath);
		await uploadBytes(imgRef, image);
		const downloadUrl = await getDownloadURL(imgRef);
		return { downloadUrl, imagePath };
	}

	return (
		<FirebaseContext.Provider
			value={{
				signupWithEmail,
				loginWithEmail,
				continueWithGoogle,
				logout,
				setUserDoc,
				getUserDoc,
				becomeSeller,
				createProduct,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
}

export default FirebaseProvider;
