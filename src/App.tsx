import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import FirebaseProvider from "@/firebase/FirebaseProvider";
import AuthProvider from "@/providers/auth/AuthProvider";
import PublicOnlyRoute from "@/route-access-control/PublicOnlyRoute";
import ProtectedRoute from "@/route-access-control/ProtectedRoute";
import Products from "@/pages/main/Products";
import MainLayout from "@/layouts/MainLayout";
import Cart from "@/pages/main/Cart";
import Orders from "@/pages/main/Orders";
import Profile from "@/pages/shared/Profile";
import SellerLayout from "@/layouts/SellerLayout";
import SellerProducts from "@/pages/seller/Products";
import SellerUplaod from "@/pages/seller/Upload";
import SellerOrders from "@/pages/seller/Orders";
import SellerRoute from "@/route-access-control/SellerRoute";
import BecomeSeller from "@/pages/seller/BecomeSeller";
import NonSellerRoute from "@/route-access-control/NonSellerRoute";

function App() {
	return (
		<FirebaseProvider>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<PublicOnlyRoute />}>
							<Route
								path="/signup"
								element={<Signup />}
							/>
							<Route
								path="/login"
								element={<Login />}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route element={<MainLayout />}>
								<Route
									index
									element={<Products />}
								/>
								<Route
									path="/products"
									element={<Products />}
								/>
								<Route
									path="/cart"
									element={<Cart />}
								/>
								<Route
									path="/orders"
									element={<Orders />}
								/>
								<Route
									path="/profile"
									element={<Profile />}
								/>
								<Route element={<NonSellerRoute />}>
									<Route
										path="seller/become"
										element={<BecomeSeller />}
									/>
								</Route>
							</Route>

							<Route element={<SellerRoute />}>
								<Route element={<SellerLayout />}>
									<Route
										path="/seller/products"
										element={<SellerProducts />}
									/>
									<Route
										path="/seller/upload"
										element={<SellerUplaod />}
									/>
									<Route
										path="/seller/orders"
										element={<SellerOrders />}
									/>
								</Route>
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</FirebaseProvider>
	);
}

export default App;
