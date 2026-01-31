import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useUploadProduct from "@/features/products/useUploadProduct";

function Upload() {
	const { loading, error, createProduct } = useUploadProduct();
	return (
		<div className="">
			<h1 className="text-3xl font-semibold">
				Hey let's ship something new!
			</h1>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const form = e.currentTarget;
					const formData = new FormData(form);
					const data = {
						name: formData.get("name") as string,
						des: formData.get("des") as string,
						price: Number(formData.get("price")),
						images: formData.getAll("images") as File[],
					};
					try {
						await createProduct(data);
						form.reset();
					} catch {
						// do nothing — error UI already handled by hook
					}
				}}
			>
				<FieldSet className="my-5">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="product name"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="des">Description</FieldLabel>
							<Textarea
								id="des"
								name="des"
								placeholder="Description of your product..."
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
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="images">Images</FieldLabel>
							<Input
								id="images"
								name="images"
								type="file"
								multiple
								placeholder="select images"
								required
							/>
						</Field>
					</FieldGroup>
				</FieldSet>
				<Button
					type="submit"
					className="cursor-pointer"
					disabled={loading}
				>
					{loading ? "Uploading..." : "Upload"}
				</Button>
				{error && (
					<p className="text-red-500 text-sm mt-2">{error.message}</p>
				)}
			</form>
		</div>
	);
}

export default Upload;
