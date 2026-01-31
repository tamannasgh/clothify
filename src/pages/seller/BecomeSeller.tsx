import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useBecomeSeller from "@/features/user/useBecomeSeller";

function BecomeSeller() {
	const { loading, becomeSeller, error } = useBecomeSeller();
	return (
		<div className="flex-1 flex flex-col items-center justify-center">
			<h1 className="text-4xl font-semibold mb-5">
				Become a Seller, Today!
			</h1>
			<Button
				className="cursor-pointer"
				disabled={loading}
				onClick={becomeSeller}
			>
				Get Started
				{loading ? <Spinner /> : null}
			</Button>
			{error && <p className="text-red-600">{error.message}</p>}
		</div>
	);
}

export default BecomeSeller;
