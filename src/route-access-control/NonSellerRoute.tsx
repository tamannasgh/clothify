import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/providers/auth/useAuth";
import { Navigate, Outlet } from "react-router";

function NonSellerRoute() {
	const { user, loading } = useAuth();

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}
	const roles: string[] = user?.roles ?? [];

	if (roles.includes("seller")) {
		return <Navigate to={"/seller/products"} />;
	}

	return <Outlet />;
}

export default NonSellerRoute;
