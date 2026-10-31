
import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
import AddNote from './AddNote';

const Notes = () => {
    const { notes, getNotes, editNote, isAuthenticated, authLoading } =
        useContext(noteContext);

    useEffect(() => {
        if (isAuthenticated) getNotes();
        // eslint-disable-next-line
    }, [isAuthenticated]);

    const ref = useRef(null);
    const refClose = useRef(null);

    const [note, setNote] = useState({
        id: "",
        etitle: "",
        edescription: "",
        etag: ""
    });

    const updateNote = (currentNote) => {
        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag || ""
        });

        ref.current.click();
    };

    const handleClick = async () => {
        const success = await editNote(
            note.id,
            note.etitle.trim(),
            note.edescription.trim(),
            note.etag.trim()
        );

        if (success) refClose.current.click();
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    if (authLoading) {
        return <p className="container mt-3">Checking your session...</p>;
    }

    if (!isAuthenticated) {
        return <p className="container mt-3">Please log in to view your notes.</p>;
    }

    return (
        <div className="container my-4">
            <AddNote />

            <button
                ref={ref}
                type="button"
                className="d-none"
                data-bs-toggle="modal"
                data-bs-target="#editNoteModal"
            />

            <div className="modal fade" id="editNoteModal" tabIndex="-1"
                aria-labelledby="editNoteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editNoteModalLabel">
                                Edit Note
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>

                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="etitle"
                                        name="etitle"
                                        value={note.etitle}
                                        onChange={onChange}
                                        minLength={3}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="edescription"
                                        name="edescription"
                                        rows="3"
                                        value={note.edescription}
                                        onChange={onChange}
                                        minLength={5}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">
                                        Tag
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="etag"
                                        name="etag"
                                        value={note.etag}
                                        onChange={onChange}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button
                                ref={refClose}
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={
                                    note.etitle.trim().length < 3 ||
                                    note.edescription.trim().length < 5
                                }
                                onClick={handleClick}
                            >
                                Update Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-4">
                <h2 className="mb-3">Your Notes</h2>

                {notes.length === 0 ? (
                    <p className="text-muted">No notes to display. Add your first note above!</p>
                ) : (
                    notes.map((note) => (
                        <Noteitem
                            key={note._id}
                            note={note}
                            updateNote={updateNote}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Notes;
