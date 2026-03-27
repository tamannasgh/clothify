import useFirebase from "@/firebase/useFirebase";
import useAuth from "@/providers/auth/useAuth";
import { useEffect, useState } from "react";
import type { Order } from "../types";

function useSellerOrderItems() {
	const [myOrderItems, setMyOrderItems] = useState<Order[]>([]);
	const [dataLoaded, setDataLoaded] = useState(false);
	const { firebaseUser } = useAuth();
	const firebase = useFirebase();

	useEffect(() => {
		if (!firebaseUser) return;
		const unsubscribe = firebase.getSellerOrders(
			firebaseUser.uid,
			(sellerOrders: Order[]) => {
				//removing the items that doesn't belong to seller
				const finalSellerOrderItems = sellerOrders.map((order) => {
					const myOrderItems = order.orderItems.filter(
						(orderItem) => orderItem.sellerId === firebaseUser.uid,
					);
					return { ...order, orderItems: myOrderItems };
				});
				setMyOrderItems(finalSellerOrderItems);
				setDataLoaded(true);
			},
		);
		return unsubscribe;
	}, [firebase, firebaseUser]);

	function markAsDelivered(orderId: string, orderItemId: string) {
		firebase.markAsDelivered(orderId, orderItemId);
	}

	return { myOrderItems, dataLoaded, markAsDelivered };
}

export default useSellerOrderItems;
