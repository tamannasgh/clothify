import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/providers/auth/useAuth";
import { Navigate } from "react-router";

function SellerRoute() {
	const { user, loading } = useAuth();

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	if (!user) {
		return (
			<Navigate
				to={"/login"}
				replace
			/>
		);
	}

	// const roles = user?.roles || ["USER"];

	return <div>SellerRoute</div>;
}

export default SellerRoute;
