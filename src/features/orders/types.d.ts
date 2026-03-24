type OrderItem = {
	id: string;
	name: string;
	images: {
		downloadUrl: string;
		imagePath: string;
	}[];
	priceAtPurchase: number;
	quantity: number;
	sellerId: string;
};
type Order = {
	id: string;
	buyerId: string;
	createdAt: Date;
	sellerIds: string[];
	orderItems: OrderItem[];
	grandTotal: number;
	status: "pending" | "delivered" | "cancelled";
};

export { OrderItem, Order };
