import useFirebase from "@/firebase/useFirebase";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";

export type Product = {
	id: string;
	name: string;
	des: string;
	price: number;
	quantity: number;
	images: { downloadUrl: string; imagePath: string }[];
	sellerId: string;
	createdAt: Date;
};

function useProduct(productId: string) {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);
	const firebase = useFirebase();

	useEffect(() => {
		async function getProduct() {
			try {
				const product = await firebase.getProduct(productId);
				console.log(product);
				if (!product.exists()) {
					throw Error("This Product doesn't exists.");
				}
				const finalProduct = {
					name: product.data().name,
					des: product.data().des,
					images: product.data().images,
					price: product.data().price,
					quantity: product.data().quantity,
					sellerId: product.data().sellerId,
					createdAt: product.data().createdAt,
				};
				setProduct({ id: product.id, ...finalProduct });
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
		getProduct();
	}, [firebase, productId]);

	return { product, loading, error };
}

export default useProduct;
