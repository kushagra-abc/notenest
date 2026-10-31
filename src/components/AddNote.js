
import React, { useContext, useState } from 'react';
import noteContext from "../context/notes/noteContext";

const AddNote = () => {
    const { addNote } = useContext(noteContext);
    const [note, setNote] = useState({
        title: "",
        description: "",
        tag: ""
    });

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await addNote(
            note.title,
            note.description,
            note.tag
        );

        if (success) {
            setNote({ title: "", description: "", tag: "" });
        }
    };

    return (
        <div className="container my-4">
            <h2 className="mb-3">Add a Note</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={note.title}
                        onChange={onChange}
                        minLength={3}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={note.description}
                        onChange={onChange}
                        minLength={5}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">
                        Tag (optional)
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="tag"
                        name="tag"
                        value={note.tag}
                        onChange={onChange}
                        placeholder="e.g. Work, Personal, Ideas"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                        note.title.trim().length < 3 ||
                        note.description.trim().length < 5
                    }
                >
                    Add Note
                </button>
            </form>
        </div>
    );
};

export default AddNote;
