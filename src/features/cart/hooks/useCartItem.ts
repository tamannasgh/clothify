import useFirebase from "@/firebase/useFirebase";
import useAuth from "@/providers/auth/useAuth";

function useCartItem() {
	const { firebaseUser } = useAuth();
	const firebase = useFirebase();

	function addToCart(productId: string) {
		if (!firebaseUser?.uid) return;
		firebase.addToCart(firebaseUser.uid, productId);
	}

	async function updateCartItemQuantity(
		cartItemId: string,
		quantity: number,
	) {
		if (!firebaseUser?.uid) return;
		firebase.updateCartItemQuantity(firebaseUser.uid, cartItemId, quantity);
	}

	return { addToCart, updateCartItemQuantity };
}

export default useCartItem;
