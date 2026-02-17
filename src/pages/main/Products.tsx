import { Spinner } from "@/components/ui/spinner";
import useProducts from "@/features/products/useProducts";

function Products() {
	const { products, error, loading } = useProducts();

	if (loading) {
		return <Spinner />;
	}

	if (error) {
		return (
			<h1 className="text-3xl font-semibold">Something went wrong!</h1>
		);
	}

	return products.length < 1 ? (
		<h1 className="text-3xl font-semibold">There are no Products yet!</h1>
	) : (
		<div>
			<h1 className="text-3xl font-semibold">Products page</h1>
			{products.map((product) => {
				return <p key={product.id}>{product.name}</p>;
			})}
		</div>
	);
}

export default Products;
