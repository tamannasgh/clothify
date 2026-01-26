import { Link } from "react-router";

function SellerSidebar() {
	return (
		<ul className="bg-gray-100 p-3 w-40 text-center rounded-t-3xl shadow-md">
			<li>
				<Link
					className="block rounded-lg px-4 py-2 hover:bg-gray-200 transition"
					to={"/seller/products"}
				>
					Products
				</Link>
			</li>
			<li>
				<Link
					className="block rounded-lg px-4 py-2 hover:bg-gray-200 transition"
					to={"/seller/upload"}
				>
					Upload
				</Link>
			</li>
			<li>
				<Link
					className="block rounded-lg px-4 py-2 hover:bg-gray-200 transition"
					to={"/seller/orders"}
				>
					Orders
				</Link>
			</li>
		</ul>
	);
}

export default SellerSidebar;
