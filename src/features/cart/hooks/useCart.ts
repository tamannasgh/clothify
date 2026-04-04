import { useEffect, useState } from "react";
import { type CartItem } from "./useCartItem";
import useAuth from "@/providers/auth/useAuth";
import useFirebase from "@/firebase/useFirebase";
import { useNavigate } from "react-router";

function useCart() {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [dataLoaded, setDataLoaded] = useState(false);
	const { firebaseUser } = useAuth();
	const firebase = useFirebase();
	const navigate = useNavigate();

	useEffect(() => {
		if (!firebaseUser) {
			return;
		}
		const unsubscribe = firebase.getCartItems(
			firebaseUser.uid,
			(cartItems: CartItem[]) => {
				setCartItems(cartItems);
				setDataLoaded(true);
			},
		);
		return unsubscribe;
	}, [firebase, firebaseUser]);

	function removeFromCart(cartItemId: string) {
		if (!firebaseUser) return;
		return firebase.updateCartItemQuantity(firebaseUser.uid, cartItemId, 0);
	}

	async function proceedPayment(cartItems: CartItem[], grandTotal: number) {
		if (!firebaseUser) return;
		const sellerIds = [...new Set(cartItems.map((item) => item.sellerId))];
		const orderItems = cartItems.map((item) => {
			return {
				id: item.id,
				name: item.name,
				images: item.images,
				priceAtPurchase: item.price,
				quantity: item.quantity,
				sellerId: item.sellerId,
				status: "pending" as const,
			};
		});
		const order = {
			buyerId: firebaseUser.uid,
			createdAt: new Date(),
			sellerIds,
			orderItems,
			grandTotal,
			status: "pending" as const, //object ke props ko baadme change kar skte h isliye ts ise string ke type mei dekhra h, pr type mei humne explicitly diya h ya to pending, delivered ya cancelled hi ho skta h isliye error aara tha, to ab humne as const likh diya isse kya hua ki humne keh diya ki ye change nhii hoga to ab ye type se match krra h isliye error gayab ho gya.
		};
		try {
			await firebase.createOrder(order, navigate);
		} catch (err) {
			console.log(err);
		}
	}

	return { cartItems, dataLoaded, removeFromCart, proceedPayment };
}

export default useCart;
