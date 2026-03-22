import useFirebase from "@/firebase/useFirebase";
import useAuth from "@/providers/auth/useAuth";
import { useEffect, useState } from "react";

function useCartItem(cartItemId: string) {
	const [itemCount, setItemCount] = useState(0);
	const { firebaseUser } = useAuth();
	const firebase = useFirebase();

	useEffect(() => {
		if (!firebaseUser?.uid) return;
		firebase.getCartItemCount(
			firebaseUser.uid,
			cartItemId,
			(quantity: number) => {
				setItemCount(quantity);
			},
		);
	}, [cartItemId, firebaseUser, firebase]);

	function addToCart(productId: string) {
		if (!firebaseUser?.uid) return;
		firebase.addToCart(firebaseUser.uid, productId);
	}

	async function updateCartItemQuantity(
		cartItemId: string,
		countToBeUpdate: number,
	) {
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
