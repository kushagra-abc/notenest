
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import NoteContext from '../context/notes/noteContext';

const Signup = () => {

    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    });

    const [error, setError] = useState("");

    const history = useHistory();

    const { getUser } = useContext(NoteContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (credentials.password !== credentials.cpassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const json = await response.json();

            if (!response.ok || !json.authtoken) {
                const message = json.errors
                    ? json.errors.map(err => err.msg).join(", ")
                    : json.error || "Unable to create account";

                setError(message);
                return;
            }

            localStorage.setItem('token', json.authtoken);

            const authenticated = await getUser();

            if (authenticated) {
                history.push("/");
            } else {
                setError("Account created, but login verification failed. Please log in.");
            }

        } catch (error) {
            setError("Unable to connect to the backend server.");
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
            <h2>Create a NoteNest Account</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={credentials.name}
                        onChange={onChange}
                        required
                        minLength={3}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
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
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={onChange}
                        required
                        minLength={5}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="cpassword"
                        name="cpassword"
                        value={credentials.cpassword}
                        onChange={onChange}
                        required
                        minLength={5}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Sign Up
                </button>

            </form>
        </div>
    );
};

export default Signup;
