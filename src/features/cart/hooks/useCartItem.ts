import useFirebase from "@/firebase/useFirebase";
import useAuth from "@/providers/auth/useAuth";
import { useEffect, useState } from "react";
import { type Product } from "@/features/products/hooks/useProduct";

export type CartItem = Product & {
	quantity: number;
};

function useCartItem(cartItemId: string) {
	const [itemCount, setItemCount] = useState(0);
	const { firebaseUser } = useAuth();
	const firebase = useFirebase();

	useEffect(() => {
		if (!firebaseUser?.uid) return;
		const unsubscribe = firebase.getCartItemCount(
			firebaseUser.uid,
			cartItemId,
			(quantity: number) => {
				setItemCount(quantity);
			},
		);

		return unsubscribe;
	}, [cartItemId, firebaseUser, firebase]);

	function addToCart() {
		if (!firebaseUser?.uid) return;
		firebase.addToCart(firebaseUser.uid, cartItemId);
	}

	async function updateCartItemQuantity(countToBeUpdate: number) {
		if (!firebaseUser?.uid) return;
		firebase.updateCartItemQuantity(
			firebaseUser.uid,
			cartItemId,
			countToBeUpdate,
		);
	}

	return { addToCart, updateCartItemQuantity, itemCount };
}

export default useCartItem;
