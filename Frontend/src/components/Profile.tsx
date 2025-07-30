import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import "../cssfiles/ProfileStyles.css";
import defaultUseravatar from '../assets/user-avatar.png';
import ProfileContentCardVideos from './ProfileContentCardVideos.tsx';
import ProfileContentCardPlaylists from './ProfileContentCardPlaylists.tsx';
import defaultCoverImage from '../assets/default-coverimage.png';

const Profile: React.FC = () => {
  // Define interfaces for our data types
  interface Channel {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    avatar: string[2];
    coverimage: string[2];
    isYourChannel: boolean;
    subscribersCount: number;
  }

  interface Video {
    _id: string;
    title: string;
    thumbnail: string;
    views: number;
    createdAt: string;
    duration: number;
  }

  interface Playlist {
    _id: string;
    name: string;
    createdAt: string;
    isPublic: boolean;
    videoCount: number;
  }

  const [activeTab, setActiveTab] = useState('videos');
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [videosCount, setVideosCount] = useState<number>(0);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribedbtnPressed, setSubscribedbtnPressed] = useState<boolean>(false);
  const { username, userid } = useParams<{ username: string, userid: string }>();
  const apiurl = import.meta.env.VITE_api_URL;

  const toggleSubscription = async () => {
    try {
      // TODO : fix link
      const response = await fetch(`${apiurl}/api/v1/subscriptions/c/${userid}`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Subscription toggled:', response);
      if (response.ok) {
        setIsSubscribed(!isSubscribed);
        setTimeout(() => {
          setSubscribedbtnPressed(false);
        }, 1000);
      } else {
        throw new Error('Failed to toggle subscription');
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }

  };

  //channel data fetching
  useEffect(() => {
    if (username && userid) {
      const response = fetch(`${apiurl}/api/v1/users/c/${userid}/${username}`, {
        method: 'GET',
        credentials: 'include',
      });
      response.then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed to fetch channel data');
        }
      }).then((data) => {
        // console.log('Channel data:', data);
        setChannel(data.data.user[0]);
        setIsSubscribed(data.data?.isSubscribed || false);
      }).catch((error) => {
        console.error('Error fetching channel data:', error);
      });
    }
  }, [isSubscribed, username, userid]);

  // Fetch Videos Uploaded by the channel
  useEffect(() => {
    if (username && userid) {
      const response = fetch(`${apiurl}/api/v1/videos/${username}/${userid}`, {
        method: 'GET',
        credentials: 'include',
      });

      response.then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed to fetch videos');
        }
      }).then((data) => {
        setVideos(data.data.videos[0].videosdata);
        setVideosCount(data.data.videos[0].videosdata.length);
      }).catch((error) => {
        console.error('Error fetching videos:', error);
      });
    }
    setPlaylists(null);
    setVideos(null);
    setActiveTab('videos');
  }, [username, userid]);

  // Fetch Playlists Created by the channel
  const fetchPlaylists = async () => {
    if (username && userid) {
      try {
        const response = await fetch(`${apiurl}/api/v1/playlists/user/${userid}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          // console.log('Playlists data:', data.data);
          setPlaylists(data.data);
        } else {
          throw new Error('Failed to fetch playlists');
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    }
  };

  return (
    <div className="profile-container">
      {/* Cover Image */}
      <div className="cover-image-container">
        <img
          src={channel?.coverimage?.[0] === undefined || channel?.coverimage?.length === 0 ? defaultCoverImage : channel?.coverimage[0]}
          alt="Channel cover"
          className="cover-image"
        />
        {/* <div className="cover-overlay"></div> */}
      </div>

      {/* Channel Info */}
      <div className="channel-info-container">
        <div className="channel-info-card">
          <div className="channel-info-content">
            <div className="avatar-container">
              <img
                src={channel?.avatar?.[0] || defaultUseravatar}
                alt="Channel Avatar"
                className="avatar-channel"
              />
            </div>

            <div className="channel-details">
              <h1 className="channel-name">{channel?.fullname}</h1>
              <p className="channel-username"><b>@{username}</b> • {channel?.subscribersCount || 0} Subscribers • {videosCount || 0} videos</p>
              <p className="channel-email">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                {channel?.email || "channel_email@example.com"}</p>

              <button className={isSubscribed ? 'subscribed-button' : 'subscribe-button'} hidden={channel?.isYourChannel} disabled={subscribedbtnPressed} onClick={() => {
                if (!subscribedbtnPressed) {
                  setSubscribedbtnPressed(true);
                  toggleSubscription();
                }
              }}  >
                {isSubscribed ? 'Subscribed' : 'Subscribe'} <span hidden={!isSubscribed}>&#x2714;</span>
              </button>
            </div>
          </div>
        </div>


        <div className="content-selector">
          <div className="selector-container">
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === 'videos' ? 'active-profile-tab' : ''}`}
                style={{
                  borderRadius: "8px 0 0 0",
                }}
                onClick={() => {
                  setActiveTab('videos')
                }}
              >
                Videos
              </button>
              <button
                className={`tab-button ${activeTab === 'playlists' ? 'active-profile-tab' : ''}`}
                style={{
                  borderRadius: "0 8px 0 0",
                }}
                onClick={() => {
                  if (playlists === null) {
                    fetchPlaylists();
                  }
                  setActiveTab('playlists')
                }}
              >
                Playlists
              </button>
            </div>
          </div>

          {/* Content Display Area */}
          <div className="content-grid profile-videos-grid" hidden={activeTab !== 'videos'}>
            {videos ? videos.map((video, index) => (
              <ProfileContentCardVideos key={index} id={video._id} thumbnail={video.thumbnail}
                views={video.views} createdAt={video.createdAt} setVideoData={() => { }} setPlaylistVideos={() => { }}
                channelid={userid} title={video.title} duration={video.duration ? video.duration : 0} hidedropdown={true} hideVideodeleteFromPlaylist={true}
              />
            )) : <p style={{ color: "#5d5d5d" }} >No Videos Uploaded Yet</p>}
          </div>

          <div className="content-grid profile-playlists-grid" hidden={activeTab !== 'playlists'}>
            {playlists ? playlists.map((playlist, index) => (
              <ProfileContentCardPlaylists key={index} _id={playlist._id} name={playlist.name}
                createdAt={playlist.createdAt} setPlaylistData={() => { }}
                isPublic={playlist.isPublic} videoCount={playlist.videoCount} hidedropdown={true}
              />
            )) : <p style={{ color: "#5d5d5d" }} >No Public Playlists Created Yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;