import { useEffect, useState } from "react";
import type { Order } from "../types";
import useFirebase from "@/firebase/useFirebase";

function useOrder(orderId: string) {
	const [order, setOrder] = useState<Order | null>(null);
	const [dataLoaded, setDataLoaded] = useState(false);
	const firebase = useFirebase();

	useEffect(() => {
		const unsubscribe = firebase.getOrder(orderId, (orderDetails) => {
			setOrder(orderDetails);
			setDataLoaded(true);
		});
		return unsubscribe;
	}, [firebase, orderId]);

	function cancelOrder() {
		if (!order) return;
		firebase.cancelOrder(order);
	}

	return { order, dataLoaded, cancelOrder };
}

export default useOrder;
