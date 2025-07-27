import '../cssfiles/ProfileStyles.css';
import '../cssfiles/PlaylistsandVideoStyles.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useRef } from 'react';
import defaultthumbnail from '../assets/default_thumbnail.png';
import useCustomHooks from '../functions/CustomHook';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useToaster, Message } from 'rsuite';

// Schema for video update validation
const VideoSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Title is too short')
        .max(50, 'Title is too long'),
    description: Yup.string()
        .min(10, 'Description is too short')
        .max(500, 'Description is too long'),
    thumbnail: Yup.mixed<File>()
        .test('fileSize', 'File size must be less than 5MB', (value) => {
            if (!value) return true;
            if (value instanceof File) {
                return value?.size <= 5 * 1024 * 1024; // 5MB
            }
        })
        .test('fileType', 'Only image files are allowed', (value) => {
            if (!value) return true;
            if (value instanceof File) {
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value?.type);
            }
        }),

});

type UpdateVideoProps = {
    title: string;
    description: string;
    thumbnail: File | null | undefined;
};
const initialUpdateVideoData: UpdateVideoProps = {
    title: '',
    description: '',
    thumbnail: undefined,
};

const labelStyles: React.CSSProperties = {
    fontWeight: 600,
    color: "#6366f1",
    letterSpacing: "0.02em"
};

interface VideoProps {
    _id: string;
    title: string;
    createdAt: string;
    duration: number;
    views: number;
    thumbnail: string;
}

interface PlaylistVideoProps {
    _id: string;
    title: string;
    thumbnail: string;
    views: number;
    duration: number;
    createdAt: string;
    owner: string;
}

const ProfileContentCardVideos: React.FC<{
    id: string;
    channelid: string | undefined;
    playlistid?: string;
    title: string;
    views: number;
    createdAt: string;
    duration: number;
    thumbnail: string;
    hidedropdown: boolean;
    hideVideodeleteFromPlaylist: boolean;
    setVideoData: React.Dispatch<React.SetStateAction<VideoProps[]>>;
    setPlaylistVideos: React.Dispatch<React.SetStateAction<PlaylistVideoProps[]>>;
}> = ({ id, channelid, title, views, createdAt, duration, playlistid = "", thumbnail, hidedropdown = true, hideVideodeleteFromPlaylist = true, setVideoData = () => { }, setPlaylistVideos = () => { } }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const VideoDeleteModalRef = useRef<HTMLDivElement>(null);
    const VideoEditModalRef = useRef<HTMLDivElement>(null);
    const VideoRemoveRef = useRef<HTMLDivElement>(null);
    const [removevideoModal, setRemoveVideoModal] = useState(false);
    const [deleteVideoModal, setDeleteVideoModal] = useState(false);
    const [editVideoModal, setEditVideoModal] = useState(false);
    const [deletingVideo, setDeletingVideo] = useState(false);
    const [thumbnailFilename, setThumbnailFilename] = useState<string | null>(null);
    const toaster = useToaster();

    const { formatYouTubeDate } = useCustomHooks();
    const imagename = thumbnail ? thumbnail.split('/').pop() || '' : '';
    const thumbnail_url = `https://res.cloudinary.com/${import.meta.env.VITE_cloudinary_client_id}/image/upload/q_40/${imagename}`; // lower quality thumbnail
    const apiURL = import.meta.env.VITE_api_URL;

    const deleteVideo = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 20000); // Abort request after 20 seconds
        try {
            const response = await fetch(`${apiURL}/api/v1/videos/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            clearTimeout(timeoutId);
            if (response.ok) {
                setVideoData((prevVideos) => prevVideos.filter(video => video._id !== id));
                toaster.push(<Message showIcon type="success">Video deleted successfully!</Message>, { placement: 'topEnd' });
            } else {
                throw new Error('Failed to delete video');
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            toaster.push(<Message showIcon type="error">Error deleting video. Please try again.</Message>, { placement: 'topEnd' });
            clearTimeout(timeoutId);
            throw error;
        }
    }

    const editVideo = async (values: UpdateVideoProps) => {
        // console.log("Form Data to be sent:", values);
        const formdata = new FormData();
        formdata.append('title', values.title);
        formdata.append('description', values.description);
        if (values.thumbnail && values.thumbnail instanceof File) {
            formdata.append('thumbnail', values?.thumbnail as File);
        } else {
            formdata.append('thumbnail', undefined as any);
        }
        // console.log("Form Data:", formdata);
        try {
            const response = await fetch(`${apiURL}/api/v1/videos/${id}`, {
                method: 'PATCH',
                // headers: {
                //     'Content-Type': 'multipart/form-data',
                // },
                body: formdata,
                credentials: 'include',
            });

            if (response.ok) {
                const updatedVideo = await response.json();
                setVideoData((prevVideos) => prevVideos.map(video => video._id === id ? { ...video, ...updatedVideo.data } : video));
                toaster.push(<Message showIcon type="success">Video updated successfully!</Message>, { placement: 'topEnd' });
                setEditVideoModal(false);
            } else {
                throw new Error('Failed to update video');
            }
        } catch (error) {
            console.error("Error updating video:", error);
            toaster.push(<Message showIcon type="error">Error updating video. Please try again.</Message>, { placement: 'topEnd' });
        }
    };

    const removeVideo = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 20000); // Abort request after 20 seconds
        try {
            const response = await fetch(`${apiURL}/api/v1/playlists/remove/${id}/${playlistid}`, {
                method: 'PATCH',
                credentials: 'include',
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (response.ok) {
                setPlaylistVideos((prevVideos) => prevVideos.filter(video => video._id !== id));
                toaster.push(<Message showIcon type="success">Video removed from playlist successfully!</Message>, { placement: 'topEnd' });
            } else {
                throw new Error('Failed to remove video from playlist');
            }
        } catch (error) {
            console.error("Error removing video from playlist:", error);
            toaster.push(<Message showIcon type="error">Error removing video from playlist. Please try again.</Message>, { placement: 'topEnd' });
            clearTimeout(timeoutId);
            throw error;
        }
    };

    return (
        <>
            <div className="content-card">
                <Link className="card-thumbnail" to={`/video/${channelid}/${id}`}>
                    <img
                        src={thumbnail_url || defaultthumbnail}
                        alt="Video Thumbnail"
                        className="profile-thumbnail-img" />
                    <span
                        className="play-icon2"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "rgba(0,0,0,0.5)",
                            borderRadius: "50%",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            opacity: 0,
                            transition: "opacity 0.3s ease, transform 0.3s ease",
                            justifyContent: "center",
                            width: "38px",
                            height: "38px",
                            zIndex: 10,
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            <polygon points="13,10 24,16 13,22" fill="white" />
                        </svg>
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
                        {Math.floor(duration ? duration / 60 : 0)}:{Math.floor(duration ? duration % 60 : 0).toString().padStart(2, '0')}
                    </span>
                </Link>
                <div className="playlist-card-action-closure">
                    <Link className="card-content" to={`/video/${channelid}/${id}`}>
                        <p className="card-title" title={title}>{title}</p>
                        <p className="card-details">{views} views • {formatYouTubeDate(createdAt)}</p>
                    </Link>
                    {!hideVideodeleteFromPlaylist && (
                        <div className='relative container-video-card-dropdownMenuIconButton'>
                            <button type='button' className='video-card-dropdownMenuIconButton'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Delete btn clicked");
                                    setRemoveVideoModal(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#db3c30" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z" />
                                </svg>
                            </button>
                        </div>
                    )}
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

                                    {/* Share Button*/}
                                    <button className="playlist-card-dropdown-items" onClick={(e) => {
                                        e.stopPropagation();
                                        const dropdown = dropdownRef.current;
                                        // copy link to the clipboard
                                        navigator.clipboard.writeText(`${window.location.origin}/video/${channelid}/${id}`);
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

                                    {/* Edit Video */}
                                    <button className="playlist-card-dropdown-items"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const modal = VideoDeleteModalRef.current;
                                            const dropdown = dropdownRef.current;
                                            if (modal && dropdown) {
                                                dropdown.classList.add("hidden");
                                                dropdown.style.transform = "scale(0) translateY(8px)";
                                                setEditVideoModal(true);
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

                                    {/* Delete Video */}
                                    <button className="playlist-card-dropdown-items"
                                        onClick={() => {
                                            const modal = VideoDeleteModalRef.current;
                                            const dropdown = dropdownRef.current;
                                            if (modal && dropdown) {
                                                dropdown.classList.add("hidden");
                                                dropdown.style.transform = "scale(0) translateY(8px)";
                                                setDeleteVideoModal(true);
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

            {/* Modal - delete btn  */}
            <div ref={VideoDeleteModalRef} tabIndex={-1} className='confirm-delete-modal' hidden={!deleteVideoModal}>
                <div className='confirm-modal-content'>
                    <div className='confirm-modal-body'>
                        <svg className="mx-auto mb-4 text-red-500 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p style={{
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#333",
                            textAlign: "center"
                        }}>Are you sure you want to delete this Video?</p>
                        <div className="confirm-modal-button-grp">
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const modal = VideoDeleteModalRef.current;
                                    setDeletingVideo(true);
                                    await deleteVideo();
                                    setDeletingVideo(false);
                                    if (modal) {
                                        setDeleteVideoModal(false);
                                    }
                                }}
                                type="button" className='confirm-modal-btn'>
                                {deletingVideo ? 'Deleting...' : 'Yes, I\'m sure'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const modal = VideoDeleteModalRef.current;
                                    if (modal) {
                                        setDeleteVideoModal(false);
                                    }
                                }}
                                type="button" className='delete-modal-btn'>No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Edit Video  */}
            <div ref={VideoEditModalRef} className='playlist-create-modal' tabIndex={-1} hidden={!editVideoModal}>
                <div className='video-edit-modal-content'>
                    {/* <!-- Modal content --> */}
                    <div className='video-edit-modal-body'>
                        {/* <!-- Modal header --> */}
                        <div className="playlist-create-modal-header">
                            <h3 className="playlist-create-modal-title">
                                Update Video
                            </h3>
                            <button
                                type="button"
                                className='playlist-create-modal-close-button'
                                onClick={() => setEditVideoModal(false)}
                            >
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* <!-- Modal body --> */}
                        <Formik
                            initialValues={initialUpdateVideoData}
                            validationSchema={VideoSchema}
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                await editVideo(values);
                                setSubmitting(false);
                                resetForm();
                                setEditVideoModal(false);
                                // Here you can add your API call to create a playlist
                                // Example:
                                // createPlaylist(values)
                                //   .then(() => {
                                //     setCreatePlaylistModal(false);
                                //     resetForm();
                                //   })

                            }}
                        >
                            {({ setFieldValue, isSubmitting, errors, touched }) => (
                                <Form className='playlist-create-modal-form'>
                                    <div className='playlist-create-modal-fields'>
                                        <div className='playlist-create-modal-field-name'>
                                            <label htmlFor="title" style={labelStyles}>Title</label>
                                            <Field
                                                type="text"
                                                name="title"
                                                id="title"
                                                minLength={2}
                                                maxLength={50}
                                                autoComplete="on"
                                                placeholder="Type video name"
                                                className={`form-input ${errors.title && touched.title ? 'input-error' : ''}`}
                                            />
                                            <ErrorMessage name="title" component="p" className="error-message" />
                                        </div>

                                        <div className='playlist-create-modal-field-description'>
                                            <label htmlFor="description" style={labelStyles}>Description</label>
                                            <Field
                                                as="textarea"
                                                id="description"
                                                name="description"
                                                rows={4}
                                                minLength={10}
                                                maxLength={500}
                                                placeholder="Write Video description here"
                                                className={`form-textarea ${errors.description && touched.description ? 'input-error' : ''}`}
                                            />
                                            <ErrorMessage name="description" component="p" className="error-message" />
                                        </div>

                                        <div className='video-edit-modal-field-thumbnail'>
                                            <label htmlFor="thumbnail" className="thumbnail-label" style={labelStyles}>Thumbnail</label>
                                            <div className='videoEdit-thumbnail-form-file-input-container'>
                                                <span className='videoEdit-thumbnail-form-file-input-label'>Choose File</span>
                                                <input
                                                    type="file"
                                                    name="thumbnail"
                                                    id="thumbnail"
                                                    style={{ cursor: "pointer" }}
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    className="videoEdit-thumbnail-form-file-input"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        if (event.currentTarget.files && event.currentTarget.files.length > 0) {
                                                            setFieldValue("thumbnail", event.currentTarget.files[0]);
                                                            setThumbnailFilename(`${event.currentTarget.files[0].name} (${(event.currentTarget.files[0].size / 1024).toFixed(2)} KB)`);
                                                        } else {
                                                            setFieldValue("thumbnail", undefined); // Reset if no file is selected
                                                            setThumbnailFilename(null);
                                                        }
                                                    }}
                                                />

                                            </div>
                                            <ErrorMessage name="thumbnail" component="p" className="error-message" />
                                            {thumbnailFilename && (
                                                <p className="video-edit-modal-field-thumbnail-preview">{thumbnailFilename}</p>
                                            )}
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

            {/* remove video from playlist modal  */}
            <div ref={VideoRemoveRef} tabIndex={-1} className='confirm-delete-modal' hidden={!removevideoModal}>
                <div className='confirm-modal-content'>
                    <div className='confirm-modal-body'>
                        <svg className="mx-auto mb-4 text-red-500 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p style={{
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: "#333",
                            textAlign: "center"
                        }}>Are you sure you want to remove this video from the playlist?</p>
                        <div className="confirm-modal-button-grp">
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const modal = VideoRemoveRef.current;
                                    setDeletingVideo(true);
                                    await removeVideo();
                                    setDeletingVideo(false);
                                    if (modal) {
                                        setRemoveVideoModal(false);
                                    }
                                }}
                                type="button" className='confirm-modal-btn'>
                                {deletingVideo ? 'Removing...' : 'Yes, I\'m sure'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const modal = VideoRemoveRef.current;
                                    if (modal) {
                                        setRemoveVideoModal(false);
                                    }
                                }}
                                type="button" className='delete-modal-btn'>No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileContentCardVideos;