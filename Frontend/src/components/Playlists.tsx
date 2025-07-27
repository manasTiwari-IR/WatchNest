import React, { useEffect, useState } from 'react'
import '../cssfiles/PlaylistsandVideoStyles.css'
import { useToaster, Message } from "rsuite";
import { useRef } from 'react';
import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import useCustomHooks from '../functions/CustomHook';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PlaylistCard = lazy(() => import('./ProfileContentCardPlaylists.tsx'));

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

type CreatePlaylistProps = {
  name: string;
  description: string;
  isPublic: boolean;
};

interface PlaylistProps {
  _id: string;
  name: string;
  createdAt: string;
  isPublic: boolean;
  videoCount: number;
}
interface UserDataProp {
  _id: string;
  fullname: string
}

const labelStyles: React.CSSProperties = {
  fontWeight: 600,
  color: "#6366f1",
  letterSpacing: "0.02em"
};
const Playlists: React.FC = () => {
  const toaster = useToaster();
  const PlaylistCreateModalRef = useRef<HTMLDivElement>(null);
  const [createPlaylistModal, setCreatePlaylistModal] = useState(false);
  const initialUserData: UserDataProp = {
    _id: '',
    fullname: ''
  }
  const initialCreatePlaylistData: CreatePlaylistProps = {
    name: '',
    description: '',
    isPublic: false
  };

  const { decryptData } = useCustomHooks();
  const apiURL = import.meta.env.VITE_api_URL;
  const data: string = useSelector((state: any) => state.userData.data);
  const key: string = useSelector((state: any) => state.userData.key);
  const [userdata, setuserData] = useState<UserDataProp>(initialUserData);
  const [PlaylistData, setPlaylistData] = useState<PlaylistProps[]>([]);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${apiURL}/api/v1/playlists/user/${userdata._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // for verify JWT
      });
      if (response.ok) {
        const data = await response.json();
        setPlaylistData(data.data);
      }
      else {
        throw new Error("Failed to fetch playlists");
      }
    } catch (error) {
      console.error('Error in fetchPlaylists:', error);
    }
  }

  const createPlaylist = async (values: CreatePlaylistProps) => {
    try {
      const response = await fetch(`${apiURL}/api/v1/playlists/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // for verify JWT
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          isPublic: values.isPublic
        })
      });
      if (response.ok) {
        const data = await response.json();
        // console.log("Playlist created successfully:", data);
        setPlaylistData((prev) => [...prev, data.data]);
        toaster.push(
          (<Message type="success" showIcon
            style={{
              backgroundColor: "#fffbe6",
              color: "black",
              borderRadius: "22px",
              fontSize: ".9rem",
            }}>
            Playlist Created Successfully!
          </Message>),
          { placement: 'topEnd', duration: 2000 }
        );
        return data;
      } else {
        throw new Error("Failed to create playlist");
      }
    } catch (error) {
      console.error('Error in createPlaylist:', error);
      toaster.push(
        (<Message type="error" showIcon
          style={{
            backgroundColor: "#fffbe6",
            color: "black",
            borderRadius: "22px",
            fontSize: ".9rem",
          }}>
          Playlist creation failed. Please try again.
        </Message>),
        { placement: 'topEnd', duration: 2000 }
      );
      throw error;
    }
  };

  useEffect(() => {
    if (data && key) {
      decryptData(data, key)
        .then((res: any) => {
          setuserData(() => {
            return {
              _id: res._id,
              fullname: res.fullname
            }
          });
        })
        .catch((error: any) => {
          console.error("Error decrypting data: ", error);
        });
    }
  }, [data, key]);

  useEffect(() => {
    if (userdata._id) {
      fetchPlaylists();
    }
  }, [userdata]);
  // console.log("PlaylistData: ", PlaylistData);

  return (
    <>
      <section className='your-playlists-container' >
        <p className='your-playlists-title' >Your Playlists</p>
        <div className="your-playlists-grid">
          {PlaylistData.length > 0 && PlaylistData.map((playlist) => (
            <Suspense key={playlist._id} fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                }}>
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }>
              <PlaylistCard _id={playlist._id} name={playlist.name} createdAt={playlist.createdAt} isPublic={playlist.isPublic} videoCount={playlist.videoCount}
                hidedropdown={false} setPlaylistData={setPlaylistData} />
            </Suspense>
          ))}
          <button className="your-playlist-create-card" type='button'
            onClick={(e) => {
              e.stopPropagation();
              const modal = PlaylistCreateModalRef.current;
              if (modal) {
                setCreatePlaylistModal((prev) => !prev);
              }
            }}>
            <div className="playlist-create-card-content">
              <div className="playlist-create-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v8m4-4H8"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <p className='playlist-create-card-title'>Create Playlist</p>
            </div>
          </button>
        </div>
      </section>

      {/* Modal - Create Playlist btn */}
      <div ref={PlaylistCreateModalRef} className='playlist-create-modal' tabIndex={-1} hidden={!createPlaylistModal}>
        <div className='playlist-create-modal-content'>
          {/* <!-- Modal content --> */}
          <div className='playlist-create-modal-body'>
            {/* <!-- Modal header --> */}
            <div className="playlist-create-modal-header">
              <h3 className="playlist-create-modal-title">
                Create Playlist
              </h3>
              <button
                type="button"
                className='playlist-create-modal-close-button'
                onClick={() => setCreatePlaylistModal(false)}
              >
                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* <!-- Modal body --> */}
            <Formik
              initialValues={initialCreatePlaylistData}
              validationSchema={PlaylistSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                await createPlaylist(values);
                setCreatePlaylistModal(false);
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
                    {isSubmitting ? 'Creating...' : 'Create Playlist'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div >
    </>
  );
}

export default Playlists;

