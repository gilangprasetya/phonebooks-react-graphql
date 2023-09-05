import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_PHONEBOOK, GET_PHONEBOOKS, UPDATE_AVATAR, UPDATE_PHONEBOOK } from '../graphql/gql';
import axios from 'axios'

export default function PhoneList({ id, name, phone, avatar }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedPhone, setEditedPhone] = useState(phone);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [updatePhonebookMutation] = useMutation(UPDATE_PHONEBOOK);
    const [deletePhonebookMutation] = useMutation(DELETE_PHONEBOOK);
    const [updateAvatarMutation] = useMutation(UPDATE_AVATAR, {
        refetchQueries: [{ query: GET_PHONEBOOKS }]
    })

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async (event) => {
        event.preventDefault();

        try {
            await updatePhonebookMutation({
                variables: {
                    id,
                    name: editedName,
                    phone: editedPhone,
                },
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    const handleDelete = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deletePhonebookMutation({
                variables: {
                    id,
                },
            });

            window.location.reload();
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
    };

    const handleAvatarChange = async (event) => {
        const picture = event.target.files[0];
        const formData = new FormData();
        formData.append("avatar", picture);

        try {
            const response = await axios.post(
                `http://localhost:3001/upload-avatar`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            await updateAvatarMutation({
                variables: { id, avatar: response.data },
            });
            window.location.reload();
        } catch (error) {
            console.error("Upload error", error);
        }
    };

    return (
        <li className="card">
            <div className="image">
                <img
                    src={avatar ? `http://localhost:3001/images/${avatar}` : '/user.png'}
                    className="img-fluid"
                    width="90px"
                    height="90px"
                    alt="Avatar"
                    onClick={() =>
                        document.getElementById(`selectAvatar${id}`).click()
                    }
                />
                <input
                    id={"selectAvatar" + id}
                    hidden
                    type="file"
                    name="avatar"
                    onChange={handleAvatarChange}
                />
            </div>
            <div className="info">
                {isEditing ? (
                    <form onSubmit={handleSaveClick}>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                        <br />
                        <input
                            type="text"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                        />
                        <br />
                    </form>
                ) : (
                    <>
                        <span className="name">{editedName}</span>
                        <br />
                        <span className="phone">{editedPhone}</span>
                        <br />
                    </>
                )}
                <br />
                <div className="btn-pd">
                    {isEditing ? (
                        <>
                            <button
                                type="submit"
                                className="btn"
                                onClick={handleSaveClick}
                                onMouseOver={(e) => (e.target.style.cursor = 'pointer')}
                                onMouseOut={(e) => (e.target.style.cursor = 'auto')}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn"
                                onClick={handleEditClick}
                                onMouseOver={(e) => (e.target.style.cursor = 'pointer')}
                                onMouseOut={(e) => (e.target.style.cursor = 'auto')}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn"
                                onMouseOver={(e) => (e.target.style.cursor = 'pointer')}
                                onMouseOut={(e) => (e.target.style.cursor = 'auto')}
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </button>

                            {showConfirmModal && (
                                <div className="confirm-modal">
                                    <div className="modal-content">
                                        <p>Are you sure you want to delete this contact?</p>
                                        <div className="modal-buttons">
                                            <button onClick={handleConfirmDelete} className="confirm-button">
                                                Yes, Delete
                                            </button>
                                            <button onClick={handleCancelDelete} className="cancel-button">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </li>
    );
}