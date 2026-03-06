import { Spinner } from "@/components/ui/spinner";
import useProducts from "@/features/products/hooks/useProducts";
import ProductCard from "@/features/products/components/ProductCard";

function ProductList({
	sellerId,
	emptyProductsLine,
}: {
	sellerId?: string;
	emptyProductsLine: React.ReactNode;
}) {
	const { loading, error, products } = useProducts(sellerId);

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	if (error) {
		return (
			<h1 className="text-3xl font-semibold">Something went wrong!</h1>
		);
	}

	return !products ? (
		<h1 className="text-2xl">{emptyProductsLine}</h1>
	) : (
		<div>
			<div className="flex mt-10 flex-wrap">
				{products.map((product) => {
					return (
						<ProductCard
							key={product.id}
							product={product}
						/>
					);
				})}
			</div>
		</div>
	);
}

export default ProductList;
