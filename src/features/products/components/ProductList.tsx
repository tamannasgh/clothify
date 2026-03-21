import { Spinner } from "@/components/ui/spinner";
import useProducts from "@/features/products/hooks/useProducts";
import ProductCard from "@/features/products/components/ProductCard";
import type { Product } from "../hooks/useProduct";

function ProductList({
	sellerId,
	emptyProductsLine,
	actionsFunctionForCard,
}: {
	sellerId?: string;
	emptyProductsLine: React.ReactNode;
	actionsFunctionForCard?: (product: Product) => React.ReactNode;
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

	return products.length < 1 ? (
		<h1 className="text-2xl">{emptyProductsLine}</h1>
	) : (
		<div className="flex flex-wrap">
			{products.map((product) => {
				return (
					<ProductCard
						key={product.id}
						product={product}
						linkTo={
							sellerId
								? `/seller/products/${product.id}`
								: `/products/${product.id}`
						}
						actions={
							actionsFunctionForCard
								? actionsFunctionForCard(product)
								: null
						}
					/>
				);
			})}
		</div>
	);
}

export default ProductList;
