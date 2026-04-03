import useFirebase from "@/firebase/useFirebase";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import type { Product, UpdateProduct } from "../types";
import useAuth from "@/providers/auth/useAuth";

function useProduct(productId: string) {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);
	const firebase = useFirebase();
	const { firebaseUser } = useAuth();

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

	async function updateProduct(
		updatedProduct: Omit<UpdateProduct, "images"> & {
			images?: File[];
		},
	) {
		if (!firebaseUser) return;

		const { images, ...finalUpdatedProduct } = updatedProduct;

		if (images) {
			const imagesUrls = await Promise.all(
				images.map(async (img) => {
					return await firebase.uploadFileAndGetUrl(
						img,
						`products/${firebaseUser.uid}/${productId}/${Date.now()}-${img.name}`,
					);
				}),
			);

			return firebase.updateProduct(productId, {
				...finalUpdatedProduct,
				images: imagesUrls,
			});
		} else {
			return firebase.updateProduct(productId, finalUpdatedProduct);
		}
	}

	return { product, loading, error, deleteProduct, updateProduct };
}

export default useProduct;
