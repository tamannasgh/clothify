import { Spinner } from "@/components/ui/spinner";
import useOrders from "@/features/orders/hooks/useOrders";
import clsx from "clsx";
import { Link } from "react-router";

function Orders() {
	const { orders, loading, error } = useOrders();

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	if (error) {
		return (
			<h1 className="text-3xl font-semibold">Something went wrong!</h1>
		);
	}

	return orders.length < 1 ? (
		<h1 className="text-3xl font-semibold">No Orders yet, let's shop!!</h1>
	) : (
		<div className="w-screen">
			{orders.map((order, index) => {
				return (
					<div
						key={order.id}
						className="flex flex-wrap w-full justify-between items-center bg-gray-50 p-5 shadow-md rounded-2xl mb-3"
					>
						<h2>
							<span className="font-semibold mr-3">
								{index + 1}.
							</span>
							<Link
								to={`/orders/${order.id}`}
								className="underline font-semibold"
							>
								order-
								{order.id.substring(0, 7)}
							</Link>
						</h2>
						<h2>
							<span className="font-semibold">On Date : </span>
							{order.createdAt.toLocaleDateString("en-IN")}
						</h2>
						<h2>
							<span className="font-semibold">Total Rs. </span>
							{order.grandTotal}
						</h2>
						<h2>
							<span className="font-semibold">Status : </span>
							<span
								className={clsx(
									order.status === "pending" &&
										"bg-yellow-300",
									order.status === "delivered" &&
										"bg-green-400",
									order.status === "cancelled" &&
										"bg-gray-300",
									"p-1 px-3 rounded-2xl",
								)}
							>
								{order.status}
							</span>
						</h2>
					</div>
				);
			})}
		</div>
	);
}

export default Orders;
