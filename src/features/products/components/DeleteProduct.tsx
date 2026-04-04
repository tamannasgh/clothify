import { Trash } from "lucide-react";
import type { Product } from "../types";
import useProduct from "../hooks/useProduct";
import { useNavigate } from "react-router";

function DeleteProduct({ product }: { product: Product }) {
	const { deleteProduct } = useProduct(product.id);
	const navigate = useNavigate();
	return (
		<Trash
			className="cursor-pointer"
			onClick={async () => {
				await deleteProduct();
				navigate(0);
			}}
		/>
	);
}

export default DeleteProduct;
