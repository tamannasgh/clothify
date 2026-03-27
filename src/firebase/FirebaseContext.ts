import type { CartItem } from "@/features/cart/hooks/useCartItem";
import type { Order } from "@/features/orders/types";
import type { Product } from "@/features/products/hooks/useProduct";
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
	deleteProduct: (productId: string) => Promise<void>;
	updateProduct: (
		productId: string,
		updatedProduct: Product,
	) => Promise<void>;
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
	createOrder: (order: Omit<Order, "id">) => Promise<void>;
	getOrders: (userId: string) => Promise<QuerySnapshot>;
	getOrder: (
		orderId: string,
		callback: (orderDetails: Order | null) => void,
	) => Unsubscribe;
	cancelOrder: (order: Order) => Promise<void>;
	markAsDelivered: (orderId: string, orderItemId: string) => Promise<void>;
	getSellerOrders: (
		sellerId: string,
		callback: (sellerOrders: Order[]) => void,
	) => Unsubscribe;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export default FirebaseContext;
