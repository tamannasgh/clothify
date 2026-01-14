import type { User } from "firebase/auth";
import { createContext } from "react";

type AuthContextType = { user: User | null; loading: boolean };

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
