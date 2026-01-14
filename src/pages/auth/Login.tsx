import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useAuthActions from "@/features/auth/useAuthActions";
import { Spinner } from "@/components/ui/spinner";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { loginWithEmail, continueWithGoogle, error, loading } =
		useAuthActions();

	return (
		<div className="h-screen w-screen flex justify-center items-center p-2">
			<div className="w-full max-w-sm">
				<FieldSet>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="text"
								placeholder="your@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Field>
					</FieldGroup>
				</FieldSet>
				{error ? (
					<FieldError errors={[{ message: error.message }]} />
				) : null}
				<Button
					className="w-full mt-7 cursor-pointer"
					disabled={loading}
					onClick={() => loginWithEmail(email, password)}
				>
					Login
					{loading ? <Spinner /> : null}
				</Button>
				<p className="text-center font-bold my-5">OR</p>
				<Button
					className="w-full cursor-pointer"
					disabled={loading}
					onClick={() => {
						continueWithGoogle();
					}}
				>
					Continue with google
					{loading ? <Spinner /> : null}
				</Button>
			</div>
		</div>
	);
}

export default Login;
