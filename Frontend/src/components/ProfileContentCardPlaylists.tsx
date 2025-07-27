import '../cssfiles/ProfileStyles.css'
import '../cssfiles/PlaylistsandVideoStyles.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useCustomHooks from '../functions/CustomHook';
import { useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useToaster, Message } from 'rsuite';

const PlaylistSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name is too short')
        .max(50, 'Name is too long')
        .required('Name is required'),
    description: Yup.string()
        .min(10, 'Description is too short')
        .max(500, 'Description is too long')
        .required('Description is required'),
    isPublic: Yup.boolean()
});
type UpdatePlaylistProps = {
    name: string;
    description: string;
    isPublic: boolean;
};
const initialUpdatePlaylistData: UpdatePlaylistProps = {
    name: '',
    description: '',
    isPublic: false,
};
const labelStyles: React.CSSProperties = {
    fontWeight: 600,
    color: "#6366f1",
    letterSpacing: "0.02em"
};

interface PlaylistProps {
    _id: string;
    name: string;
    createdAt: string;
    isPublic: boolean;
    videoCount: number;
}

const ProfileContentCardPlaylists: React.FC<{
    _id: string;
    name: string;
    createdAt: string;
    isPublic: boolean;
    videoCount: number;
    hidedropdown?: boolean;
    // Function to set playlist data in parent component
    setPlaylistData: React.Dispatch<React.SetStateAction<PlaylistProps[]>>;
}> = ({ _id, name, createdAt, isPublic, videoCount, hidedropdown = true, setPlaylistData }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const PlaylistDeleteModalRef = useRef<HTMLDivElement>(null);
    const PlaylistEditModalRef = useRef<HTMLDivElement>(null);
    const [deletePlaylistModal, setDeletePlaylistModal] = useState(false);
    const [editPlaylistModal, setEditPlaylistModal] = useState(false);
    const [deletingPlaylist, setDeletingPlaylist] = useState(false);
    const toaster = useToaster();

    const { formatYouTubeDate } = useCustomHooks();
    const createdDate = formatYouTubeDate(createdAt);
    const apiURL = import.meta.env.VITE_api_URL;

    const deletePlaylist = async () => {
        const controller = new AbortController();
        const timeOutId = setTimeout(() => {
            controller.abort();
        }, 15000);  // Abort request after 6 seconds
        try {
            const response = await fetch(`${apiURL}/api/v1/playlists/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            clearTimeout(timeOutId); // Clear timeout if request completes in time
            if (response.ok) {
                // console.log("Playlist deleted successfully");
                // Optionally, you can update the state to remove the deleted playlist
                setPlaylistData((prev: PlaylistProps[]) => prev.filter((playlist: PlaylistProps) => playlist._id !== _id));
                toaster.push(
                    (<Message type="success" showIcon
                        style={{
                            backgroundColor: "#fffbe6",
                            color: "black",
                            borderRadius: "22px",
                            fontSize: ".9rem",
                        }}>
                        Playlist Deleted Successfully!
                    </Message>),
                    { placement: 'topEnd', duration: 2000 }
                );
            } else {
                throw new Error('Failed to delete playlist');
            }
        } catch (error) {
            console.error("Error deleting playlist:", error);
            toaster.push(
                (<Message type="error" showIcon
                    style={{
                        backgroundColor: "#fffbe6",
                        color: "black",
                        borderRadius: "22px",
                        fontSize: ".9rem",
                    }}>
                    Playlist deletion failed. Please try again.
                </Message>),
                { placement: 'topEnd', duration: 2000 }
            );
            throw error;
        }
    };

    const updatePlaylist = async (values: UpdatePlaylistProps) => {
        const controller = new AbortController();
        const timeOutId = setTimeout(() => {
            controller.abort();
        }, 15000);  // Abort request after 10 seconds
        try {
            const response = await fetch(`${apiURL}/api/v1/playlists/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
                credentials: 'include',
                signal: controller.signal
            });
            clearTimeout(timeOutId); // Clear timeout if request completes in time
            if (response.ok) {
                await response.json();
                setPlaylistData((prev: PlaylistProps[]) => prev.map((playlist: PlaylistProps) => playlist._id === _id ? { ...playlist, ...values } : playlist));

                toaster.push(
                    (<Message type="success" showIcon
                        style={{
                            backgroundColor: "#fffbe6",
                            color: "black",
                            borderRadius: "22px",
                            fontSize: ".9rem",
                        }}>
                        Playlist Updated Successfully!
                    </Message>),
                    { placement: 'topEnd', duration: 2000 }
                );
            } else {
                throw new Error('Failed to update playlist');
            }
        } catch (error) {
            toaster.push(
                (<Message type="error" showIcon
                    style={{
                        backgroundColor: "#fffbe6",
                        color: "black",
                        borderRadius: "22px",
                        fontSize: ".9rem",
                    }}>
                    Playlist update failed. Please try again.
                </Message>),
                { placement: 'topEnd', duration: 2000 }
            );
            throw error;
        }
    };

    return (
        <>
            <div className="content-card-playlist">
                <Link className="card-playlist-thumbnail" to={`/dashboard/playlists/${_id}`}>
                    <span
                        className="playlist-video-stack-icon"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            // background: "rgba(0,0,0,0.5)",
                            borderRadius: "50%",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            opacity: 1,
                            transition: "all .2s ease-in-out",
                            justifyContent: "center",
                            width: "38px",
                            height: "38px",
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="#353535" d="M11.5 13.577L17.077 10L11.5 6.423zM8.116 17q-.691 0-1.153-.462T6.5 15.385V4.615q0-.69.463-1.153T8.116 3h10.769q.69 0 1.153.462t.462 1.153v10.77q0 .69-.462 1.152T18.884 17zm0-1h10.769q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T18.884 4H8.116q-.231 0-.424.192t-.192.423v10.77q0 .23.192.423t.423.192m-3 4q-.69 0-1.153-.462T3.5 18.385V6.615h1v11.77q0 .23.192.423t.423.192h11.77v1zM7.5 4v12z" /></svg>
                    </span>
                    <span
                        className="duration-tag2"
                        style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            transition: "background 0.3s ease"
                        }}
                    >
                        {videoCount} {videoCount === 1 ? 'video' : 'videos'}
                    </span>
                </Link>
                <div className="playlist-card-action-closure">
                    <Link className="card-content" to={`/dashboard/playlists/${_id}`}>
                        <p className="card-title">{name}</p>
                        <p className="card-details" style={{ marginTop: '4px' }}> {hidedropdown && (`Created ${createdDate}`)}
                            {!hidedropdown && (isPublic ? 'Public' : 'Private')}</p>
                    </Link>
                    {!hidedropdown && (
                        <div className="relative">
                            <button id="playlist-card-dropdownMenuIconButton"
                                style={{ borderRadius: "50%", marginRight: "0.5rem" }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const dropdown = dropdownRef.current;
                                    if (dropdown) {
                                        dropdown.classList.toggle("hidden");
                                        dropdown.style.transform = dropdown.classList.contains("hidden") ? "scale(0) translateY(8px)" : "scale(1) translateY(0)";
                                    }
                                }}
                                className="items-center p-1 text-sm font-medium text-center text-gray-900 bg-transparent hover:bg-gray-200 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 rounded-full mr-2"
                                type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#333" d="M9 15.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.249 1.249 0 1 1 2.5 0a1.25 1.25 0 1 1-2.5 0" /></svg>
                            </button>
                            <div className="playlist-dropdown-menu hidden" ref={dropdownRef}
                                style={{
                                    position: "absolute",
                                    maxWidth: "150px",
                                    minWidth: "10px",
                                    backgroundColor: "white",
                                    borderRadius: "0.5rem",
                                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                                    zIndex: 10,
                                    transformOrigin: "top right",
                                    top: "-400%",
                                    right: "100%",
                                    transition: "all 100ms ease",
                                }}>
                                <ul
                                    style={{
                                        padding: ".5rem",
                                        fontSize: "0.875rem",
                                        color: "#333",
                                        listStyle: "none",
                                        margin: 0
                                    }}>
                                    {/* Share Playlist */}
                                    <button className="playlist-card-dropdown-items"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const dropdown = dropdownRef.current;
                                            // copy link to the clipboard
                                            navigator.clipboard.writeText(`${window.location.origin}/dashboard/playlists/${_id}`);
                                            toaster.push(<Message showIcon type="success">Link copied to clipboard</Message>, { placement: 'topEnd' });
                                            if (dropdown) {
                                                dropdown.classList.add("hidden");
                                                dropdown.style.transform = "scale(0) translateY(8px)";
                                            }
                                        }}>
                                        <div
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                textAlign: "left",
                                            }}>Share
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="currentColor" d="M19.59 12L15 7.41v2.46l-.86.13c-4.31.61-7.23 2.87-8.9 6.33c2.32-1.64 5.2-2.43 8.76-2.43h1v2.69m-2-1.69v.02c-4.47.21-7.67 1.82-10 5.08c1-5 4-10 11-11V5l7 7l-7 7v-4.1c-.33 0-.66.01-1 .02Z" /></svg>
                                    </button>

                                    {/* Edit Playlist */}
                                    <button className="playlist-card-dropdown-items"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const modal = PlaylistEditModalRef.current;
                                            const dropdown = dropdownRef.current;
                                            if (modal && dropdown) {
                                                dropdown.classList.add("hidden");
                                                dropdown.style.transform = "scale(0) translateY(8px)";
                                                setEditPlaylistModal(true);
                                            }
                                        }}>
                                        <div
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                textAlign: "left",
                                            }}>Edit
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></g></svg>
                                    </button>

                                    {/* Delete Playlist */}
                                    <button className="playlist-card-dropdown-items"
                                        onClick={() => {
                                            const modal = PlaylistDeleteModalRef.current;
                                            const dropdown = dropdownRef.current;
                                            if (modal && dropdown) {
                                                dropdown.classList.add("hidden");
                                                dropdown.style.transform = "scale(0) translateY(8px)";
                                                setDeletePlaylistModal(true);
                                            }
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                textAlign: "left",
                                                color: "#dd5555",
                                            }}>Delete
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="#dd5555" d="M6 20V6H5V5h4v-.77h6V5h4v1h-1v14zm1-1h10V6H7zm2.808-2h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" /></svg>
                                    </button>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {/* Modal - delete btn */}
            <div ref={PlaylistDeleteModalRef} tabIndex={-1} className='confirm-delete-modal' hidden={!deletePlaylistModal}>
                <div className='confirm-modal-content'>
                    <div className='confirm-modal-body'>
                        <svg className="mx-auto mb-4 text-red-500 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p style={{
                            marginBottom: "1rem",
                            fontSize: "1rem",
                        }}>Are you sure you want to delete this Playlist?</p>
                        <div className="confirm-modal-button-grp">
                            <button
                                style={{
                                    backgroundColor: deletingPlaylist ? '#eb6157' : '#db3c30'
                                }}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setDeletingPlaylist(true);
                                    await deletePlaylist();
                                    setDeletingPlaylist(false);
                                    const modal = PlaylistDeleteModalRef.current;
                                    if (modal) {
                                        setDeletePlaylistModal(false);
                                    }
                                }}
                                type="button" className='confirm-modal-btn'>
                                {deletingPlaylist ? 'Deleting...' : 'Yes, I am sure'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const modal = PlaylistDeleteModalRef.current;
                                    if (modal) {
                                        setDeletePlaylistModal(false);
                                    }
                                }}
                                type="button" className='delete-modal-btn'>No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit Playlist  */}
            <div ref={PlaylistEditModalRef} className='playlist-create-modal' tabIndex={-1} hidden={!editPlaylistModal}>
                <div className='playlist-create-modal-content'>
                    {/* <!-- Modal content --> */}
                    <div className='playlist-create-modal-body'>
                        {/* <!-- Modal header --> */}
                        <div className="playlist-create-modal-header">
                            <h3 className="playlist-create-modal-title">
                                Update Playlist
                            </h3>
                            <button
                                type="button"
                                className='playlist-create-modal-close-button'
                                onClick={() => {
                                    setEditPlaylistModal(false)
                                }}
                            >
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <Formik
                            initialValues={initialUpdatePlaylistData}
                            validationSchema={PlaylistSchema}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                // console.log("Form Data: ", values);
                                await updatePlaylist(values);
                                setEditPlaylistModal(false);
                                setSubmitting(false);
                                resetForm();
                            }}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className='playlist-create-modal-form'>
                                    <div className='playlist-create-modal-fields'>
                                        <div className='playlist-create-modal-field-name'>
                                            <label htmlFor="name" style={labelStyles}>Name</label>
                                            <Field
                                                type="text"
                                                name="name"
                                                id="name"
                                                minLength={2}
                                                maxLength={50}
                                                placeholder="Type playlist name"
                                                className={`form-input ${errors.name && touched.name ? 'input-error' : ''}`}
                                            />
                                            <ErrorMessage name="name" component="p" className="error-message" />
                                        </div>

                                        <div className='playlist-create-modal-field-description'>
                                            <label htmlFor="description" style={labelStyles}>Playlist Description</label>
                                            <Field
                                                as="textarea"
                                                id="description"
                                                name="description"
                                                rows={4}
                                                minLength={10}
                                                maxLength={500}
                                                placeholder="Write playlist description here"
                                                className={`form-textarea ${errors.description && touched.description ? 'input-error' : ''}`}
                                            />
                                            <ErrorMessage name="description" component="p" className="error-message" />
                                        </div>

                                        <div className='playlist-create-modal-field-isPublic'>
                                            <Field
                                                type="checkbox"
                                                name="isPublic"
                                                id="isPublic"
                                                className="form-checkbox"
                                            />
                                            <label htmlFor="isPublic" className="checkbox-label">Public</label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className='playlist-create-modal-save-button'
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div >
        </>
    );
};

export default ProfileContentCardPlaylists;