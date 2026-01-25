import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router";

function MainLayout() {
	return (
		<div className="flex flex-col min-h-dvh">
			<Navbar />
			<div className="p-10 flex-1">
				<Outlet />
			</div>
			<Footer />
		</div>
	);
}

export default MainLayout;
