import { Trash } from "lucide-react";
import type { Product } from "../hooks/useProduct";
import useProduct from "../hooks/useProduct";

function DeleteProduct({ product }: { product: Product }) {
	const { deleteProduct } = useProduct(product.id);
	return (
		<Trash
			className="cursor-pointer"
			onClick={() => {
				deleteProduct();
			}}
		/>
	);
}

export default DeleteProduct;
