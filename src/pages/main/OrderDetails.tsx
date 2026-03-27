import { Spinner } from "@/components/ui/spinner";
import useOrder from "@/features/orders/hooks/useOrder";
import clsx from "clsx";
import { useParams } from "react-router";

function OrderDetails() {
	const { orderId } = useParams();

	const { order, dataLoaded, cancelOrder } = useOrder(orderId!);

	if (!dataLoaded) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	if (!order)
		return <h1 className="text-3xl font-semibold">Invalid order</h1>;

	return (
		<div className="w-screen">
			<h1 className="text-2xl font-semibold">
				Order Details : order-{order.id.substring(0, 7)}
			</h1>
			<div className="flex flex-wrap w-full mt-10 space-x-10 md:space-x-20 ">
				<div className="w-78">
					{order.orderItems.map((orderItem) => {
						return (
							<div
								key={orderItem.id}
								className="bg-gray-50 mb-3 shadow-md rounded-2xl flex"
							>
								<img
									src={orderItem.images[0].downloadUrl}
									alt={orderItem.name + "-img"}
									className="w-32 h-32 rounded-l-2xl object-cover object-top"
								/>
								<div className="p-3 px-5 text-sm">
									<h1 className="font-semibold">
										{orderItem.name}
									</h1>
									<h2 className="text-gray-500">
										Rs. {orderItem.priceAtPurchase} each
									</h2>
									<h2 className="text-gray-500">
										Quantity: {orderItem.quantity}
									</h2>
									<h2>
										Total:{" "}
										{orderItem.quantity *
											orderItem.priceAtPurchase}
									</h2>
									<h2>
										Status: <span>{orderItem.status}</span>
									</h2>
								</div>
							</div>
						);
					})}
				</div>
				<div className="space-y-4">
					<h1 className="font-semibold text-xl">
						Grand Total : {order.grandTotal}
					</h1>
					<h2>
						<span className="font-semibold">Status : </span>
						<span
							className={clsx(
								order.status === "pending" && "bg-yellow-300",
								order.status === "delivered" && "bg-green-400",
								order.status === "cancelled" && "bg-gray-300",
								"p-1 px-3 rounded-2xl",
							)}
						>
							{order.status}
						</span>
					</h2>
					{order.status === "pending" && (
						<button
							className="bg-gray-300 w-48 p-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-white"
							onClick={cancelOrder}
						>
							Cancel Order
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default OrderDetails;
