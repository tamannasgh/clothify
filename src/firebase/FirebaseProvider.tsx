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
	getDocs,
	query,
	where,
	deleteDoc,
	onSnapshot,
	writeBatch,
	increment,
	orderBy,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { CartItem } from "@/features/cart/hooks/useCartItem";
import type { Order } from "@/features/orders/types";

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
		stock: number;
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
			stock: data.stock,
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

	async function getProducts(sellerId?: string) {
		const colRef = collection(db, "products");
		const q = sellerId
			? query(colRef, where("sellerId", "==", sellerId))
			: query(colRef);
		const querySnapshot = await getDocs(q);
		return querySnapshot;
	}

	function getProduct(productId: string) {
		const docRef = doc(db, "products", productId);
		return getDoc(docRef);
	}

	function addToCart(userId: string, productId: string) {
		const docRef = doc(db, "users", userId, "cart", productId);
		return setDoc(docRef, { quantity: 1 });
	}

	function updateCartItemQuantity(
		userId: string,
		cartItemId: string,
		quantity: number,
	) {
		const docRef = doc(db, "users", userId, "cart", cartItemId);
		if (quantity < 1) {
			return deleteDoc(docRef);
		}
		return updateDoc(docRef, { quantity });
	}

	function getCartItemCount(
		userId: string,
		cartItemId: string,
		callback: (quantity: number) => void,
	) {
		const docRef = doc(db, "users", userId, "cart", cartItemId);
		const unsubscribe = onSnapshot(docRef, (doc) => {
			if (doc.exists()) {
				callback(doc.data().quantity);
			} else {
				callback(0);
			}
		});
		return unsubscribe;
	}

	function getCartItems(
		userId: string,
		callback: (cartItems: CartItem[]) => void,
	) {
		const colRef = collection(db, "users", userId, "cart");
		const unsubscribe = onSnapshot(query(colRef), async (cartItems) => {
			const FinalCartItems = await Promise.all(
				cartItems.docs.map(async (item) => {
					const productDetails = await getProduct(item.id);
					return {
						...(productDetails.data() as Omit<
							CartItem,
							"id" | "quantity"
						>),
						quantity: item.data().quantity,
						id: item.id,
					};
				}),
			);
			callback(FinalCartItems);
		});
		return unsubscribe;
	}

	async function createOrder(order: Omit<Order, "id">) {
		try {
			const batch = writeBatch(db);

			const docRef = doc(collection(db, "orders"));

			//create order doc in oredrs collection
			batch.set(docRef, order);

			//clear cart - delete all docs from cart collection
			const cartDocs = await getDocs(
				collection(db, "users", order.buyerId, "cart"),
			);
			cartDocs.forEach((cartDoc) => {
				batch.delete(cartDoc.ref);
			});

			//update quantity of all products
			order.orderItems.forEach((orderItem) => {
				const orderItemRef = doc(db, "products", orderItem.id);
				batch.update(orderItemRef, {
					stock: increment(-orderItem.quantity),
				});
			});

			await batch.commit();
		} catch (err) {
			console.log("Error occured: ", err);
			throw err;
		}
	}

	function getOrders(userId: string, isSeller?: boolean) {
		const colRef = collection(db, "orders");
		const q = isSeller
			? query(
					colRef,
					where("sellerIds", "array-contains", userId),
					orderBy("createdAt", "desc"),
				)
			: query(
					colRef,
					where("buyerId", "==", userId),
					orderBy("createdAt", "desc"),
				);
		return getDocs(q);
	}

	function getOrder(
		orderId: string,
		callback: (orderDetails: Order | null) => void,
	) {
		const docRef = doc(db, "orders", orderId);
		const unsubscribe = onSnapshot(docRef, (order) => {
			if (!order.exists()) {
				callback(null);
				return;
			}
			callback({
				id: order.id,
				...(order.data() as Omit<Order, "id" | "createdAt">),
				createdAt: order.data()?.createdAt.toDate(),
			});
		});
		return unsubscribe;
	}

	async function cancelOrder(order: Order) {
		try {
			const batch = writeBatch(db);

			const docRef = doc(db, "orders", order.id);

			//updating status to cancel for each individual item
			const updatedOrderItems = order.orderItems.map((orderItem) => {
				return {
					...orderItem,
					status: "cancelled",
				};
			});

			//update order doc in oredrs collection
			batch.update(docRef, {
				status: "cancelled",
				orderItems: updatedOrderItems,
			});

			//update quantity of all products
			order.orderItems.forEach((orderItem) => {
				const orderItemRef = doc(db, "products", orderItem.id);
				batch.update(orderItemRef, {
					stock: increment(orderItem.quantity),
				});
			});

			await batch.commit();
		} catch (err) {
			console.log("Error occured: ", err);
			throw err;
		}
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
				getProducts,
				getProduct,
				addToCart,
				updateCartItemQuantity,
				getCartItemCount,
				getCartItems,
				createOrder,
				getOrders,
				getOrder,
				cancelOrder,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
}

export default FirebaseProvider;
