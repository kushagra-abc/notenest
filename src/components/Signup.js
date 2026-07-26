import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Signup = () => {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    });

    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Check if passwords match
        if (credentials.password !== credentials.cpassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // 2. Fetch call to Express backend
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
            console.log("Response from server:", json);

            if (json.authtoken) {
                // Save auth token and redirect to home route
                localStorage.setItem('token', json.authtoken);
                alert("Account Created Successfully!");
                history.push("/");
            } else {
                alert(json.error || "Invalid Details");
            }
        } catch (error) {
            console.error("Error signing up:", error);
            alert("Unable to connect to backend server.");
        }
    }

    const onChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }

    return (
        <div className="container mt-3">
            <h2>Create an Account</h2>
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
    )
}

export default Signup;