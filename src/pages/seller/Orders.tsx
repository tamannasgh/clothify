import useOrders from "@/features/orders/hooks/useOrders";

function Orders() {
	const { orders } = useOrders(true);
	console.log(orders);

	return <div>Seler Orders</div>;
}

export default Orders;
