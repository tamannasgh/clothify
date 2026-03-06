import type { Product } from "../hooks/useProduct";
import { Link } from "react-router";

function ProductCard({ product }: { product: Product }) {
	return (
		<Link
			to={`/products/${product.id}`}
			className="shadow-lg w-48 my-3 mx-2"
		>
			<img
				src={product.images[0].downloadUrl}
				alt="product image"
				className="w-full h-40 object-cover object-top rounded-t-4xl"
			/>
			<div className="p-4">
				<h2
					key={product.id}
					className="text-xl font-semibold"
				>
					{product.name.length > 15
						? product.name.substring(0, 15) + "..."
						: product.name}
				</h2>
				<h3 className="text-sm">Rs.{product.price}</h3>
				<p className="text-xs">
					{product.des.length > 18
						? product.des.substring(0, 18) + "..."
						: product.des}
				</p>
			</div>
		</Link>
	);
}

export default ProductCard;
