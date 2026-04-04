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
import { auth, db, functions, storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import type { CartItem } from "@/features/cart/hooks/useCartItem";
import type { Order } from "@/features/orders/types";
import type { UpdateProduct } from "@/features/products/types";
import { httpsCallable } from "firebase/functions";
import type { NavigateFunction } from "react-router";

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

	function deleteProduct(productId: string) {
		return deleteDoc(doc(db, "products", productId));
	}

	function updateProduct(productId: string, updatedProduct: UpdateProduct) {
		const docRef = doc(db, "products", productId);
		return updateDoc(docRef, { ...updatedProduct });
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

	async function createOrder(
		order: Omit<Order, "id">,
		navigate: NavigateFunction,
	) {
		try {
			const createRazorpayOrder = httpsCallable(
				functions,
				"createRazorpayOrder",
			);
			const result = await createRazorpayOrder({
				amount: order.grandTotal * 100,
			});
			console.log(result);

			const data = result.data as { id: string };

			const options = {
				key: "rzp_test_SZMh8p1pn1fdXN",
				amount: order.grandTotal * 100,
				currency: "INR",
				order_id: data.id,
				handler: async function (response: any) {
					console.log(response, "hey");

					const verifyPayment = httpsCallable(
						functions,
						"verifyPayment",
					);
					const isPaymentVarified = await verifyPayment(response);

					if (isPaymentVarified) {
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
							const orderItemRef = doc(
								db,
								"products",
								orderItem.id,
							);
							batch.update(orderItemRef, {
								stock: increment(-orderItem.quantity),
							});
						});

						await batch.commit();
						navigate("/orders");
					} else {
						throw new Error("Payment Not Succesful.");
					}
				},
			};

			const rzp = new (window as any).Razorpay(options);
			rzp.open();
		} catch (err) {
			console.log("Error occured: ", err);
			throw err;
		}
	}

	function getOrders(userId: string) {
		const colRef = collection(db, "orders");
		return getDocs(
			query(
				colRef,
				where("buyerId", "==", userId),
				orderBy("createdAt", "desc"),
			),
		);
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

			//updating status to cancel for each individual item that are not delivered yet
			const updatedOrderItems = order.orderItems.map((orderItem) => {
				if (orderItem.status === "delivered") {
					return {
						...orderItem,
					};
				}
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

			//update quantity of all products that are pending
			order.orderItems.forEach((orderItem) => {
				if (orderItem.status === "pending") {
					const orderItemRef = doc(db, "products", orderItem.id);
					batch.update(orderItemRef, {
						stock: increment(orderItem.quantity),
					});
				}
			});

			await batch.commit();
		} catch (err) {
			console.log("Error occured: ", err);
			throw err;
		}
	}

	async function markAsDelivered(orderId: string, orderItemId: string) {
		try {
			const batch = writeBatch(db);
			const orderDocRef = doc(db, "orders", orderId);

			const order = await getDoc(orderDocRef);
			const finalOrder = {
				id: order.id,
				...(order.data() as Omit<Order, "id">),
			};

			const areAllItemsDelivered = finalOrder.orderItems.map((item) => {
				if (item.id === orderItemId) {
					return true;
				}
				return item.status === "delivered";
			});

			const updatedOrderItems = finalOrder.orderItems.map((orderItem) => {
				if (orderItem.id === orderItemId) {
					return {
						...orderItem,
						status: "delivered",
					};
				}
				return orderItem;
			});

			if (areAllItemsDelivered.includes(false)) {
				batch.update(orderDocRef, {
					orderItems: updatedOrderItems,
				});
			} else {
				batch.update(orderDocRef, {
					status: "delivered",
					orderItems: updatedOrderItems,
				});
			}

			await batch.commit();
		} catch (err) {
			console.log("Error occured: ", err);
			throw err;
		}
	}

	function getSellerOrders(
		sellerId: string,
		callback: (sellerOrders: Order[]) => void,
	) {
		const colRef = collection(db, "orders");
		const q = query(
			colRef,
			where("sellerIds", "array-contains", sellerId),
			orderBy("createdAt", "desc"),
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const sellerOrders = querySnapshot.docs.map((sellerOrder) => {
				return {
					id: sellerOrder.id,
					...(sellerOrder.data() as Omit<Order, "id" | "createdAt">),
					createdAt: sellerOrder.data().createdAt.toDate(),
				};
			});
			callback(sellerOrders);
		});

		return unsubscribe;
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
				deleteProduct,
				updateProduct,
				uploadFileAndGetUrl,
				addToCart,
				updateCartItemQuantity,
				getCartItemCount,
				getCartItems,
				createOrder,
				getOrders,
				getOrder,
				cancelOrder,
				markAsDelivered,
				getSellerOrders,
			}}
		>
			{children}
		</FirebaseContext.Provider>
	);
}

export default FirebaseProvider;
