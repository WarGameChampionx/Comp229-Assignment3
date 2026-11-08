
import { createContext, useContext, useState } from "react";
import { signIn as apiSignIn, signUp as apiSignUp } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = sessionStorage.getItem("portfolioUser");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    async function login(email, password) {
        const result = await apiSignIn({ email, password });

        sessionStorage.setItem("portfolioToken", result.token);
        sessionStorage.setItem("portfolioUser", JSON.stringify(result.user));

        setUser(result.user);
        return result;
    }

    async function register(name, email, password) {
        return await apiSignUp({ name, email, password });
    }

    function logout() {
        sessionStorage.removeItem("portfolioToken");
        sessionStorage.removeItem("portfolioUser");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isAdmin: user?.role === "admin"
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
