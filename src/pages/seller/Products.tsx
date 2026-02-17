import { Spinner } from "@/components/ui/spinner";
import useProducts from "@/features/products/useProducts";
import useAuth from "@/providers/auth/useAuth";
import { Link } from "react-router";

function Products() {
	const { firebaseUser } = useAuth();

	const { products, error, loading } = useProducts(firebaseUser?.uid);

	if (loading) {
		return <Spinner />;
	}

	if (error) {
		return (
			<h1 className="text-3xl font-semibold">Something went wrong!</h1>
		);
	}

	return products.length < 1 ? (
		<h1 className="text-3xl font-semibold">
			There are no Products yet create one{" "}
			<Link
				to={"/seller/upload"}
				className="underline"
			>
				here
			</Link>
			!
		</h1>
	) : (
		<div>
			<h1 className="text-3xl font-semibold">Your products</h1>
			{products.map((product) => {
				return <p key={product.id}>{product.name}</p>;
			})}
		</div>
	);
}

export default Products;
