import Navbar from "@/components/layout/Navbar";
import SellerSidebar from "@/components/layout/SellerSidebar";
import { Outlet } from "react-router";

function SellerLayout() {
	return (
		<div className="h-dvh">
			<Navbar />
			<div className="flex h-full">
				<SellerSidebar />
				<div className="p-10">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default SellerLayout;
