import type { CartItem } from "@/features/cart/hooks/useCartItem";
import type { Order } from "@/features/orders/types";
import type { UserCredential } from "firebase/auth";
import type {
	DocumentSnapshot,
	QuerySnapshot,
	Unsubscribe,
} from "firebase/firestore";
import { createContext } from "react";

type FirebaseContextType = {
	signupWithEmail: (
		email: string,
		password: string,
	) => Promise<UserCredential>;
	loginWithEmail: (
		email: string,
		password: string,
	) => Promise<UserCredential>;
	continueWithGoogle: () => Promise<UserCredential>;
	logout: () => Promise<void>;
	setUserDoc: (data: {
		uid: string;
		name: string;
		email: string;
		photoUrl: string;
	}) => Promise<void>;
	getUserDoc: (uid: string) => Promise<DocumentSnapshot>;
	becomeSeller: (uid: string) => Promise<void>;
	createProduct: (data: {
		name: string;
		des: string;
		price: number;
		stock: number;
		images: File[];
		sellerId: string;
	}) => Promise<void>;
	getProducts: (sellerId?: string) => Promise<QuerySnapshot>;
	getProduct: (productId: string) => Promise<DocumentSnapshot>;
	addToCart: (userId: string, productId: string) => Promise<void>;
	updateCartItemQuantity: (
		userId: string,
		cartItemId: string,
		quantity: number,
	) => Promise<void>;
	getCartItemCount: (
		userId: string,
		cartItemId: string,
		callback: (quantity: number) => void,
	) => Unsubscribe;
	getCartItems: (
		userId: string,
		callback: (cartItems: CartItem[]) => void,
	) => Unsubscribe;
	createOrder: (order: Order) => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export default FirebaseContext;
