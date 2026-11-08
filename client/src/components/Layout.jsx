
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Layout() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <header>
            <div className="title-area">
                <img
                    src={logo}
                    alt="Portfolio Logo"
                    className="logo"
                />
                <h1>My Portfolio</h1>
            </div>

            <nav className="site-nav" aria-label="Main navigation">
                <div className="nav-main">
                    <Link to="/">Home</Link>
                    <Link to="/about">About Me</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/education">Education</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/contact">Contact Me</Link>
                </div>

                <div className="nav-account">
                    {user ? (
                        <>
                            <span className="nav-welcome">
                                Welcome, {user.name}
                            </span>

                            {isAdmin && (
                                <Link to="/admin">
                                    Admin Dashboard
                                </Link>
                            )}

                            <button
                                type="button"
                                className="nav-logout"
                                onClick={handleLogout}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin">Sign In</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

            <hr />
        </header>
    );
}
