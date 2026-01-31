import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useAuthActions from "@/features/auth/useAuthActions";
import { Spinner } from "@/components/ui/spinner";

function Signup() {
	const { signupWithEmail, continueWithGoogle, error, loading } =
		useAuthActions();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className="h-screen w-screen flex justify-center items-center p-2">
			<div className="w-full max-w-sm">
				<FieldSet>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input
								id="name"
								type="text"
								placeholder="full name"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="text"
								placeholder="your@email.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<FieldDescription>
								Must be at least 8 characters long.
							</FieldDescription>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								required
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
					onClick={() => signupWithEmail(name, email, password)}
				>
					Sign up
					{loading ? <Spinner /> : null}
				</Button>
				<p className="text-center font-bold my-5">OR</p>
				<Button
					className="w-full cursor-pointer"
					disabled={loading}
					onClick={continueWithGoogle}
				>
					Continue with google
					{loading ? <Spinner /> : null}
				</Button>
			</div>
		</div>
	);
}

export default Signup;
