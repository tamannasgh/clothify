import { Spinner } from "@/components/ui/spinner";
import useOrders from "@/features/orders/hooks/useOrders";
import clsx from "clsx";

function Orders() {
	const { orders, loading, error, markAsDelivered } = useOrders(true);

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	if (error) {
		return (
			<h1 className="text-3xl font-semibold">Something went wrong!</h1>
		);
	}

	const myItems = orders.flatMap((order) => {
		return order.orderItems.map((orderItem) => {
			return {
				...orderItem,
				orderId: order.id,
				createdAt: order.createdAt,
			};
		});
	});

	console.log(myItems);

	return myItems.length < 1 ? (
		<h1 className="text-3xl font-semibold">
			No Orders yet! lets upload whats in demand!
		</h1>
	) : (
		<div>
			<div className="w-full space-y-5 pb-7">
				{myItems.map((item) => {
					return (
						<div className="flex flex-wrap space-x-3 bg-gray-50 w-full rounded-2xl shadow-md">
							<img
								src={item.images[0].downloadUrl}
								alt={item.name + "-img"}
								className="w-32 h-32 rounded-l-2xl object-cover object-top"
							/>
							<div className="flex flex-1 justify-between p-1 px-3 items-center flex-wrap space-y-3 space-x-3">
								<div>
									<h2 className="font-semibold">
										{item.name}
									</h2>
									<h2 className="text-gray-500">
										Rs. {item.priceAtPurchase}
									</h2>
									<h2 className="text-gray-500">
										Quantity: {item.quantity}
									</h2>
								</div>
								<div className="space-y-4">
									<h2>
										<span className="font-semibold">
											On date:{" "}
										</span>
										{item.createdAt.toLocaleDateString(
											"en-IN",
										)}
									</h2>
									<h2>
										<span className="font-semibold">
											Total Rs.{" "}
										</span>
										{item.priceAtPurchase * item.quantity}
									</h2>
								</div>

								<div className="space-y-4">
									<h2>
										<span className="font-semibold">
											Status :{" "}
										</span>
										<span
											className={clsx(
												item.status === "pending" &&
													"bg-yellow-300",
												item.status === "delivered" &&
													"bg-green-400",
												item.status === "cancelled" &&
													"bg-gray-300",
												"p-1 px-3 rounded-2xl",
											)}
										>
											{item.status}
										</span>
									</h2>
									{item.status === "pending" && (
										<button
											className="bg-green-400 p-2 px-5 rounded-lg hover:bg-green-500 cursor-pointer hover:text-white"
											onClick={() =>
												markAsDelivered(
													item.orderId,
													item.id,
												)
											}
										>
											Mark as delivered
										</button>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Orders;
