import useFirebase from "@/firebase/useFirebase";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";

type Product = {
	id: string;
	name: string;
	des: string;
	price: number;
	quantity: number;
	images: { downloadUrl: string; imagePath: string }[];
	sellerId: string;
	createdAt: Date;
};

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
					const productData = {
						name: product.data().name,
						des: product.data().des,
						images: product.data().images,
						price: product.data().price,
						quantity: product.data().quantity,
						sellerId: product.data().sellerId,
						createdAt: product.data().createdAt,
					};
					return { id: product.id, ...productData };
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
