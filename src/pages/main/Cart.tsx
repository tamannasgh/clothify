import { Spinner } from "@/components/ui/spinner";
import AddToCart from "@/features/cart/components/AddToCart";
import useCart from "@/features/cart/hooks/useCart";
import { Trash } from "lucide-react";

function Cart() {
	const { cartItems, dataLoaded, removeFromCart } = useCart();

	if (!dataLoaded) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	return cartItems.length < 1 ? (
		<h1 className="text-3xl font-semibold">Cart is empty!</h1>
	) : (
		<div className="w-screen">
			{cartItems.map((item) => {
				return (
					<div
						key={item.id}
						className="flex bg-gray-50 mb-3 w-full shadow-lg rounded-2xl"
					>
						<img
							src={item.images[0].downloadUrl}
							alt={item.name + " image"}
							className="w-24 h-24 rounded-2xl"
						/>
						<div className="flex items-center justify-between w-full px-7">
							<h1>{item.name}</h1>
							<h2>Rs. {item.price} each</h2>
							<div className="w-32">
								<AddToCart product={item} />
							</div>

							<h2>Total: Rs.{item.price * item.quantity}</h2>
							<Trash
								className="cursor-pointer hover:text-gray-700"
								onClick={() => {
									removeFromCart(item.id);
								}}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Cart;
