
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import { useContext } from 'react';

import Navbar from './components/Navbar';
import { Home } from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Signup from './components/Signup';
import Login from './components/Login';
import NoteContext from './context/notes/noteContext';

// Protect routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authLoading } = useContext(NoteContext);

    if (authLoading) {
        return <p className="container mt-3">Checking your session...</p>;
    }

    return isAuthenticated ? children : <Redirect to="/login" />;
};

function App() {
    return (
        <NoteState>
            <Router>
                <Navbar />

                <div className="container">
                    <Switch>

                        <Route exact path="/login">
                            <Login />
                        </Route>

                        <Route exact path="/signup">
                            <Signup />
                        </Route>

                        <Route exact path="/about">
                            <About />
                        </Route>

                        <Route exact path="/">
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        </Route>

                    </Switch>
                </div>
            </Router>
        </NoteState>
    );
}

export default App;
