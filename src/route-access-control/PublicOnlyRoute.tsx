import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/providers/auth/useAuth";
import { Outlet, Navigate } from "react-router";

function PublicOnlyRoutes() {
	const { user, loading } = useAuth();

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	return user ? (
		<Navigate
			to={"/products"}
			replace
		/>
	) : (
		<Outlet />
	);
}

export default PublicOnlyRoutes;
