import React, { useEffect, useState } from 'react'
import '../cssfiles/PlaylistsandVideoStyles.css'
import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import useCustomHooks from '../functions/CustomHook';


const YourVideoCard = lazy(() => import('./ProfileContentCardVideos.tsx'));

interface LikedVideosProps {
  _id: string;
  title: string;
  createdAt: string;
  duration: number;
  views: number;
  thumbnail: string;
}
interface UserDataProp {
  _id: string;
  fullname: string;
  username: string;
}


const LikedVideos: React.FC = () => {
  const { decryptData } = useCustomHooks();
  const initialUserData: UserDataProp = {
    _id: '',
    fullname: '',
    username: '',
  };
  const data: string = useSelector((state: any) => state.userData.data);
  const key: string = useSelector((state: any) => state.userData.key);
  const apiURL = import.meta.env.VITE_api_URL;

  const [userdata, setuserData] = useState<UserDataProp>(initialUserData);
  const [LikedVideosData, setLikedVideosData] = useState<LikedVideosProps[]>([]);

  useEffect(() => {
    if (data && key) {
      decryptData(data, key)
        .then((res: any) => {
          setuserData(() => {
            return {
              _id: res._id,
              fullname: res.fullname,
              username: res.username
            }
          });
        })
        .catch((error: any) => {
          console.error("Error decrypting data: ", error);
        });
    }
  }, [data, key]);

  const fetchLikedVideos = async () => {
    try {
      const response = await fetch(`${apiURL}/api/v1/likes/videos`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        console.log(response);
        const data = await response.json();
        setLikedVideosData(data.data[0].videosdata);
      } else {
        throw new Error("Failed to fetch liked videos");
      }
    } catch (error) {
      console.error("Error fetching liked videos: ", error);
      throw error;
    }
  };

  useEffect(() => {
    if (userdata._id) {
      fetchLikedVideos();
    }
  }, [userdata, apiURL]);
  return (
    <section className='your-playlists-container' >
      <p className='your-playlists-title' >Liked Videos</p>
      <div className="your-playlists-grid">
        {LikedVideosData.length === 0 && (
          <div className="no-videos-message">
            <p>No videos found in your liked videos.</p>
          </div>
        )}
        {LikedVideosData.length > 0 && LikedVideosData.map((video) => (
          <Suspense key={video._id} fallback={
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
            <YourVideoCard key={video._id} id={video._id} title={video.title} createdAt={video.createdAt} views={video.views} duration={video.duration}
              channelid={userdata._id} thumbnail={video.thumbnail} hidedropdown={true}
              hideVideodeleteFromPlaylist={true} setVideoData={() => { }}
              setPlaylistVideos={() => { }} />
          </Suspense>
        ))}
      </div>
    </section>
  )
}

export default LikedVideos;