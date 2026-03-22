import { useEffect, useState } from "react";
import { type CartItem } from "./useCartItem";
import useAuth from "@/providers/auth/useAuth";
import useFirebase from "@/firebase/useFirebase";

function useCart() {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [dataLoaded, setDataLoaded] = useState(false);
	const { firebaseUser } = useAuth();
	const firebase = useFirebase();

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

	return { cartItems, dataLoaded, removeFromCart };
}

export default useCart;
