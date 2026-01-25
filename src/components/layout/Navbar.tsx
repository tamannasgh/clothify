import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { User } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import useFirebase from "@/firebase/useFirebase";

function Navbar() {
	const { logout } = useFirebase();
	return (
		<nav className="w-full flex justify-between items-center p-10 py-2.5 rounded-b-3xl shadow-md">
			<h1>
				<Link to={"/"}>Clothify</Link>
			</h1>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink>
							<Link to={"/products"}>Products</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink>
							<Link to={"/cart"}>Cart</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>
							<User />
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul>
								<li>
									<NavigationMenuLink>
										<Link to={"/orders"}>Orders</Link>
									</NavigationMenuLink>
								</li>
								<li>
									<NavigationMenuLink>
										<Link to={"/profile"}>Profile</Link>
									</NavigationMenuLink>
								</li>
								<li>
									<NavigationMenuLink>
										<Link to={"/seller/products"}>
											Seller Panel
										</Link>
									</NavigationMenuLink>
								</li>
								<li>
									<Button
										variant={"destructive"}
										className="cursor-pointer"
										onClick={logout}
									>
										Logout
									</Button>
								</li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</nav>
	);
}

export default Navbar;
