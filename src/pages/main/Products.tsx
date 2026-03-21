import AddToCart from "@/features/cart/components/AddToCart";
import ProductList from "@/features/products/components/ProductList";
import type { Product } from "@/features/products/hooks/useProduct";

function Products() {
	return (
		<div>
			<ProductList
				emptyProductsLine="There are no products yet!"
				actionsFunctionForCard={(product: Product) => (
					<AddToCart product={product} />
				)}
			/>
		</div>
	);
}

export default Products;
