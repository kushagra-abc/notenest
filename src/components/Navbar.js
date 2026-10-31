
import React, { useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import NoteContext from '../context/notes/noteContext';

const Navbar = () => {
    const location = useLocation();
    const history = useHistory();

    const { user, isAuthenticated, logout } = useContext(NoteContext);

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    NoteNest
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                                to="/about"
                            >
                                About
                            </Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <span className="text-light">
                                    Welcome, {user?.name}
                                </span>

                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="btn btn-outline-light btn-sm" to="/login">
                                    Login
                                </Link>

                                <Link className="btn btn-primary btn-sm" to="/signup">
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
