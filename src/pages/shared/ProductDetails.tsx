import { Spinner } from "@/components/ui/spinner";
import useProduct from "@/features/products/hooks/useProduct";
import { useParams } from "react-router";

function ProductDetails() {
	const { productId } = useParams();

	const { product, loading, error } = useProduct(productId!);

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	if (error) {
		return (
			<>
				<h1 className="text-3xl font-semibold mb-5">Product Details</h1>
				<h2 className="text-xl">{error.message}!</h2>
			</>
		);
	}

	return !product ? (
		<div>
			<h1 className="text-3xl font-semibold mb-5">Product Details</h1>
			<h2 className="text-xl">This product doesn't exists!</h2>
		</div>
	) : (
		<div>
			<h1 className="text-3xl font-semibold mb-5">Product Details</h1>

			<div className="flex">
				<img
					className="h-96 object-contain"
					src={product.images[0].downloadUrl}
					alt="product image"
				/>
				<div className="ml-5">
					<h2 className="text-2xl font-semibold mb-3">
						{product.name}
					</h2>
					<h3>Rs. {product.price}</h3>
					<p>{product.des}</p>
				</div>
			</div>
		</div>
	);
}

export default ProductDetails;
