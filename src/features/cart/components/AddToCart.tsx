import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import type { Product } from "@/features/products/hooks/useProduct";
import clsx from "clsx";
import useCartItem from "../hooks/useCartItem";

function AddToCart({ product }: { product: Product }) {
	const [itemCount, setItemCount] = useState(0);
	const { addToCart, updateCartItemQuantity } = useCartItem();

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		console.log("clicked", product.name);
		setItemCount(1);
		addToCart(product.id);
	}

	function updateCart(e: React.MouseEvent, increase: boolean) {
		e.stopPropagation();
		e.preventDefault();
		const countToBeUpdate = increase ? itemCount + 1 : itemCount - 1;
		setItemCount(countToBeUpdate);
		console.log("will update the cart to ", countToBeUpdate, product.name);
		updateCartItemQuantity(product.id, countToBeUpdate);
	}

	return itemCount < 1 ? (
		<button
			className="bg-yellow-300 hover:bg-yellow-400 w-full p-1.5 font-semibold cursor-pointer"
			onClick={handleClick}
		>
			Add to cart
		</button>
	) : (
		<div
			className="bg-yellow-300 hover:bg-yellow-400 w-full p-1.5 font-semibold flex justify-center items-center cursor-default"
			onClick={(e: React.MouseEvent) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<Minus
				size={16}
				className="cursor-pointer"
				onClick={(e: React.MouseEvent) => {
					updateCart(e, false);
				}}
			/>
			<p className="px-5">{itemCount}</p>

			<Plus
				size={16}
				className={clsx(
					itemCount < product.quantity && "cursor-pointer",
					itemCount >= product.quantity &&
						"cursor-not-allowed text-gray-600",
				)}
				onClick={(e: React.MouseEvent) => {
					if (itemCount >= product.quantity) return;
					updateCart(e, true);
				}}
			/>
		</div>
	);
}

export default AddToCart;
