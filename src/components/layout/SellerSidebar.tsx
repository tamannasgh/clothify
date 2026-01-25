import { Link } from "react-router";

function SellerSidebar() {
	return (
		<ul className="bg-gray-100 p-3 rounded-t-3xl shadow-md space-y-2">
			<li>
				<Link
					className="hover:bg-gray-200 px-5 py-2"
					to={"/seller/products"}
				>
					Products
				</Link>
			</li>
			<li>
				<Link
					className="hover:bg-gray-200 px-5 py-2"
					to={"/seller/upload"}
				>
					Upload
				</Link>
			</li>
			<li>
				<Link
					className="hover:bg-gray-200 px-5 py-2"
					to={"/seller/orders"}
				>
					Orders
				</Link>
			</li>
		</ul>
	);
}

export default SellerSidebar;
