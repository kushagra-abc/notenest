
import React, { useContext } from 'react';
import noteContext from "../context/notes/noteContext";

const Noteitem = ({ note, updateNote }) => {
    const { deleteNote } = useContext(noteContext);

    return (
        <div className="col-md-4 col-lg-3 mb-3">
            <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{note.title}</h5>

                    <p className="card-text text-secondary">
                        {note.description}
                    </p>

                    <div className="mt-auto">
                        <span className="badge bg-light text-dark border mb-3">
                            {note.tag || 'General'}
                        </span>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => updateNote(note)}
                            >
                                Edit
                            </button>

                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteNote(note._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Noteitem;
