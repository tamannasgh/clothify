export type Product = {
	id: string;
	name: string;
	des: string;
	price: number;
	stock: number;
	images: { downloadUrl: string; imagePath: string }[];
	sellerId: string;
	createdAt: Date;
};

export type UpdateProduct = Partial<
	Omit<Product, "id" | "createdAt" | "sellerId">
>;
