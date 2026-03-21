import useFirebase from "@/firebase/useFirebase";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { type Product } from "@/features/products/hooks/useProduct";

function useProducts(sellerId?: string) {
	const [products, setProducts] = useState<Product[]>([]);
	const [error, setError] = useState<FirebaseError | null>(null);
	const [loading, setLoading] = useState(false);
	const firebase = useFirebase();

	useEffect(() => {
		async function getProducts() {
			try {
				setError(null);
				setLoading(true);
				const products = await firebase.getProducts(sellerId);
				const finalData = products.docs.map((product) => {
					return {
						id: product.id,
						...(product.data() as Omit<Product, "id">),
					};
				});
				setProducts(finalData);
			} catch (e) {
				console.log("there was some error");
				const err =
					e instanceof FirebaseError
						? e
						: new FirebaseError(
								"unknown",
								"Unknown error occurred",
							);

				setError(err);
				throw err;
			} finally {
				setLoading(false);
			}
		}
		getProducts();
	}, [firebase, sellerId]);

	return { products, error, loading };
}

export default useProducts;
