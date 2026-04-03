import useAuth from "@/providers/auth/useAuth";
import { Link, useNavigate } from "react-router";
import ProductList from "@/features/products/components/ProductList";
import { Spinner } from "@/components/ui/spinner";
import DeleteProduct from "@/features/products/components/DeleteProduct";
import type { Product } from "@/features/products/types";
import { Edit2 } from "lucide-react";

function Products() {
	const { firebaseUser, loading } = useAuth();
	const navigate = useNavigate();

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	return (
		<div>
			<ProductList
				sellerId={firebaseUser?.uid}
				emptyProductsLine={
					<>
						There are no Products yet create one{" "}
						<Link
							to="/seller/upload"
							className="underline"
						>
							here
						</Link>
						!
					</>
				}
				actionsFunctionForCard={(product: Product) => (
					<div
						className="border-t cursor-auto p-2 flex justify-between px-3"
						onClick={(e: React.MouseEvent) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<DeleteProduct product={product} />
						<Edit2
							className="cursor-pointer"
							onClick={() => {
								navigate(
									`/seller/products/${product.id}/edit`,
									{
										state: {
											product,
										},
									},
								);
							}}
						/>
					</div>
				)}
			/>
		</div>
	);
}

export default Products;
