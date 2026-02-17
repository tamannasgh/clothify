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
			<div className="flex gap-4 mt-10">
				{products.map((product) => {
					return (
						<div className="shadow-lg">
							<img
								src={product.images[0].downloadUrl}
								alt="product image"
								className="w-full h-36 object-cover object-top rounded-t-4xl"
							/>
							<div className="p-4">
								<h2
									key={product.id}
									className="text-xl font-semibold"
								>
									{product.name}
								</h2>
								<h3 className="text-sm">Rs.{product.price}</h3>
								<p className="text-xs">{product.des}</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Products;
