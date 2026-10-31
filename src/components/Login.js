
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import NoteContext from '../context/notes/noteContext';

const Login = () => {

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const history = useHistory();

    const { getUser } = useContext(NoteContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const json = await response.json();

            if (!response.ok || !json.success) {
                setError(json.error || "Invalid credentials");
                return;
            }

            localStorage.setItem('token', json.authtoken);

            const authenticated = await getUser();

            if (authenticated) {
                history.push("/");
            } else {
                setError("Unable to verify your login. Please try again.");
            }

        } catch (error) {
            setError("Unable to connect to the server.");
        }
    };

    const onChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mt-3">
            <h2>Login to NoteNest</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>

                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>

                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={onChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
