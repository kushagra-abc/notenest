
import NoteContext from "./noteContext";
import { useState, useEffect } from "react";

const NoteState = (props) => {

    const host = process.env.REACT_APP_API_URL || "http://localhost:5000";

    // Notes state
    const [notes, setNotes] = useState([]);

    // Authentication state
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Reusable headers containing the current JWT
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
    });


    // Get logged-in user details and verify JWT
    const getUser = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setAuthLoading(false);
            return false;
        }

        try {
            const response = await fetch(`${host}/api/auth/getuser`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error("Authentication failed");
            }

            const userData = await response.json();

            setUser(userData);
            setIsAuthenticated(true);

            return true;

        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            setNotes([]);

            return false;

        } finally {
            setAuthLoading(false);
        }
    };


    // Verify existing session when application loads
    useEffect(() => {
        getUser();
        // eslint-disable-next-line
    }, []);


    // Logout user
    const logout = () => {
        localStorage.removeItem('token');

        setUser(null);
        setIsAuthenticated(false);
        setNotes([]);
    };


    // Get all Notes
    const getNotes = async () => {
        try {
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error("Unable to fetch notes");
            }

            const json = await response.json();
            setNotes(json);

        } catch (error) {
            console.error("Error fetching notes:", error.message);
            setNotes([]);
        }
    };


    // Add a Note
    const addNote = async (title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/addnote`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ title, description, tag })
            });

            if (!response.ok) {
                throw new Error("Unable to add note");
            }

            const note = await response.json();

            setNotes(prevNotes => prevNotes.concat(note));

            return true;

        } catch (error) {
            console.error("Error adding note:", error.message);
            return false;
        }
    };


    // Delete a Note
    const deleteNote = async (id) => {
        try {
            const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error("Unable to delete note");
            }

            setNotes(prevNotes =>
                prevNotes.filter(note => note._id !== id)
            );

            return true;

        } catch (error) {
            console.error("Error deleting note:", error.message);
            return false;
        }
    };


    // Edit a Note
    const editNote = async (id, title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ title, description, tag })
            });

            if (!response.ok) {
                throw new Error("Unable to update note");
            }

            await response.json();

            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === id
                        ? { ...note, title, description, tag }
                        : note
                )
            );

            return true;

        } catch (error) {
            console.error("Error updating note:", error.message);
            return false;
        }
    };


    return (
        <NoteContext.Provider value={{
            notes,
            addNote,
            deleteNote,
            editNote,
            getNotes,
            user,
            isAuthenticated,
            authLoading,
            getUser,
            logout
        }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
