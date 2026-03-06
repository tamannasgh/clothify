import useAuth from "@/providers/auth/useAuth";
import { Link } from "react-router";
import ProductList from "@/features/products/components/ProductList";

function Products() {
	const { firebaseUser } = useAuth();

	return (
		<div>
			<h1 className="text-3xl font-semibold mb-5">Your products</h1>
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
			/>
		</div>
	);
}

export default Products;
