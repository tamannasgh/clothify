import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "@/pages/auth/Signup";
import Login from "@/pages/auth/Login";
import FirebaseProvider from "./firebase/FirebaseProvider";
import Dashboard from "./pages/dashboard/Dashboard";
import AuthProvider from "./providers/auth/AuthProvider";
import PublicOnlyRoute from "./route-access-control/PublicOnlyRoute";
import ProtectedRoute from "./route-access-control/ProtectedRoute";

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
							<Route
								path="/dashboard"
								element={<Dashboard />}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</FirebaseProvider>
	);
}

export default App;
