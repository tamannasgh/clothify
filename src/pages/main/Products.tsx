import ProductList from "@/features/products/components/ProductList";

function Products() {
	return (
		<div>
			<h1 className="text-3xl font-semibold mb-5">Products page</h1>
			<ProductList emptyProductsLine="There are no products yet!" />
		</div>
	);
}

export default Products;
