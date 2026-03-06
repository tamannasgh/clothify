import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/providers/auth/useAuth";

function Profile() {
	const { user, loading } = useAuth();

	if (loading) {
		return <Spinner className="w-1/6 m-auto h-1/12 mt-24" />;
	}

	return !user ? (
		<h1 className="text-3xl font-semibold">User not found</h1>
	) : (
		<div className="w-full">
			<h1 className="text-3xl font-semibold mb-5">Profile</h1>
			<div className="md:flex items-center justify-between md:rounded-full shadow-lg md:w-96 p-2 pr-7">
				<img
					src={user.photoUrl}
					alt="user profile picture"
					className="rounded-full"
				/>
				<div>
					<h2 className="text-2xl">{user.name}</h2>
					<p className="text-sm">{user.email}</p>
				</div>
			</div>
		</div>
	);
}

export default Profile;
