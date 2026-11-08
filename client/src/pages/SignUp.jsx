
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 12) {
            setError("Password must contain at least 12 characters.");
            return;
        }

        if (new TextEncoder().encode(password).length > 72) {
            setError("Password exceeds 72 UTF-8 bytes.");
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            setSuccess("Registration successful! You can now sign in.");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <h2>Create Account</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="signup-name">Name</label>
                    <input
                        id="signup-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                    />
                </div>

                <div>
                    <label htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={12}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div>
                    <label htmlFor="signup-confirm">Confirm Password</label>
                    <input
                        id="signup-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                {error && <p role="alert">{error}</p>}
                {success && <p role="status">{success}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>

            <p>
                Already registered? <Link to="/signin">Sign In</Link>
            </p>

            {success && (
                <button type="button" onClick={() => navigate("/signin")}>
                    Continue to Sign In
                </button>
            )}
        </main>
    );
}
