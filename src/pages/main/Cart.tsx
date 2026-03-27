import { Spinner } from "@/components/ui/spinner";
import AddToCart from "@/features/cart/components/AddToCart";
import useCart from "@/features/cart/hooks/useCart";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router";

function Cart() {
	const { cartItems, dataLoaded, removeFromCart, proceedPayment } = useCart();
	const navigate = useNavigate();

	if (!dataLoaded) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	const grandTotal = cartItems.reduce(
		(prevVal, currItem) => prevVal + currItem.price * currItem.quantity,
		0,
	);

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
							className="w-24 h-24 rounded-l-2xl object-cover object-top"
						/>
						<div className="flex flex-wrap space-x-3 space-y-3 items-center justify-between w-full px-7">
							<div>
								<h1 className="font-semibold">{item.name}</h1>
								<h2 className="text-gray-500">
									Rs. {item.price} each
								</h2>
							</div>
							<div className="w-32">
								<AddToCart product={item} />
							</div>
							<h2>
								<span className="font-semibold">Total:</span>{" "}
								Rs.{item.price * item.quantity}
							</h2>
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
			<div className="text-center mt-10">
				<h2 className="text-xl">Grand Total: {grandTotal}</h2>
				<button
					className="cursor-pointer bg-yellow-300 py-3 px-7 rounded-2xl font-semibold mt-3 hover:bg-yellow-400"
					onClick={async () => {
						await proceedPayment(cartItems, grandTotal);
						navigate("/orders");
					}}
				>
					Proceed Payment
				</button>
			</div>
		</div>
	);
}

export default Cart;
