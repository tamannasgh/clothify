import { useEffect, useState } from "react";
import type { Order } from "../types";
import { FirebaseError } from "firebase/app";
import useAuth from "@/providers/auth/useAuth";
import useFirebase from "@/firebase/useFirebase";

function useOrders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<FirebaseError | null>(null);
	const { firebaseUser } = useAuth();
	const firebase = useFirebase();

	useEffect(() => {
		async function getOrders() {
			if (!firebaseUser) {
				setLoading(false);
				return;
			}
			try {
				setLoading(true);
				setError(null);
				const orders = await firebase.getOrders(firebaseUser.uid);
				const formattedOrders = orders.docs.map((order) => {
					return {
						id: order.id,
						...(order.data() as Omit<Order, "id" | "createdAt">),
						createdAt: order.data().createdAt?.toDate(), //converting timestamp from firebase to date
					};
				});

				setOrders(formattedOrders);
			} catch (e) {
				const err =
					e instanceof FirebaseError
						? e
						: new FirebaseError(
								"Unknown",
								"unknown error occured.",
							);
				setError(err);
			} finally {
				setLoading(false);
			}
		}
		getOrders();
	}, [firebaseUser, firebase]);

	return { orders, loading, error };
}

export default useOrders;
