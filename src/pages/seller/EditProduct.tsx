import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useProduct from "@/features/products/hooks/useProduct";
import type { Product, UpdateProduct } from "@/features/products/types";
import { useLocation, useNavigate } from "react-router";

function EditProduct() {
	const location = useLocation();
	const product: Product = location.state.product;
	const { updateProduct } = useProduct(product.id);
	const navigate = useNavigate();

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const form = e.currentTarget;
				const formData = new FormData(form);
				const data: Omit<UpdateProduct, "images"> & {
					images?: File[];
				} = {
					name: formData.get("name") as string,
					des: formData.get("des") as string,
					price: Number(formData.get("price")),
					stock: Number(formData.get("stock")),
				};

				const images = formData.getAll("images") as File[];
				if (images[0].name !== "") {
					data.images = images;
				}

				try {
					await updateProduct(data);
					navigate("/seller/products");
				} catch {
					// do nothing — error UI already handled by hook
				}
			}}
		>
			<FieldSet className="my-5">
				<div className="md:flex gap-x-5 justify-between space-y-5">
					<FieldGroup>
						<img
							src={product.images[0].downloadUrl}
							className="w-80"
						/>
						<Field>
							<FieldLabel htmlFor="images">
								Change Images
							</FieldLabel>
							<Input
								id="images"
								name="images"
								type="file"
								multiple
								placeholder="select images"
							/>
						</Field>
					</FieldGroup>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="product name"
								defaultValue={product.name}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="des">Description</FieldLabel>
							<Textarea
								id="des"
								name="des"
								placeholder="Description of your product..."
								defaultValue={product.des}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="price">Price</FieldLabel>
							<Input
								id="price"
								name="price"
								type="number"
								placeholder="price"
								defaultValue={product.price}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="quantity">Stock</FieldLabel>
							<Input
								id="stock"
								name="stock"
								type="number"
								placeholder="stock"
								defaultValue={product.stock}
								required
							/>
						</Field>
					</FieldGroup>
				</div>
			</FieldSet>
			<Button
				type="submit"
				className="cursor-pointer"
				// disabled={loading}
			>
				{/* {loading ? "Uploading..." : "Upload"} */}
				Update
			</Button>
			{/* {error && (
				<p className="text-red-500 text-sm mt-2">{error.message}</p>
			)} */}
		</form>
	);
}

export default EditProduct;
