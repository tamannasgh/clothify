import useFirebase from "@/firebase/useFirebase";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";

export type Product = {
	id: string;
	name: string;
	des: string;
	price: number;
	stock: number;
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
				if (!product.exists()) {
					setProduct(null);
				} else {
					setProduct({
						id: product.id,
						...(product.data() as Omit<Product, "id">),
					});
				}
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

	function deleteProduct() {
		firebase.deleteProduct(productId);
	}

	function updateProduct(updatedProduct: Product) {
		firebase.updateProduct(productId, updatedProduct);
	}

	return { product, loading, error, deleteProduct, updateProduct };
}

export default useProduct;
