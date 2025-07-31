import React from 'react'
import { Link } from 'react-router-dom'
import useCustomHooks from '../functions/CustomHook.ts';
import '../cssfiles/DashboardStyles.css'
import defaultThumbnail from '../assets/default_thumbnail.png';
import defaultUserAvatar from '../assets/user-avatar.png';

interface ApiVideoResponse {
    _id: string;
    title: string;
    channel: {
        _id: string;
        fullname: string;
        avatar: string[];
    };
    thumbnail: string;
    keys: string[];
    views: number;
    duration?: number;
    createdAt?: string;
}

const VideoCard: React.FC<{ video: ApiVideoResponse }> = ({ video }) => {
    // get image type from the thumbnail URL
    const imageType = video.thumbnail.split('.').pop();
    // console.log("Image Type:", imageType);
    const thumbnail_url = `https://res.cloudinary.com/${import.meta.env.VITE_cloudinary_client_id}/image/upload/q_40/${video.keys[1]}.${imageType}`; // lower quality thumbnail
    const { formatYouTubeDate } = useCustomHooks();
    const time = video.createdAt ? formatYouTubeDate(video.createdAt) : "Unknown";
    return (
        <>
            <Link
                className="video-card"
                to={`/video/${video.channel._id}/${video._id}`}
            >
                <div className="video-thumb-wrapper">
                    <img
                        src={thumbnail_url || defaultThumbnail}
                        alt="Video Thumbnail"
                        className="video-thumb"
                    />
                    <span
                        className="play-icon"
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
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            <polygon points="13,10 24,16 13,22" fill="white" />
                        </svg>
                    </span>
                    <span
                        className="duration-tag"
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
                        {Math.floor(video?.duration ? video?.duration / 60 : 0)}:{Math.floor(video?.duration ? video?.duration % 60 : 0).toString().padStart(2, '0')}
                    </span>
                </div>
                <div className="video-info" style={{ transition: "transform 0.2s ease" }}>
                    <div className="video-title">
                        <img
                            src={video?.channel?.avatar[0] || defaultUserAvatar}
                            alt="User Avatar"
                            className="avatar channel-avatar"
                            style={{ transition: "transform 0.3s ease" }}
                        />
                        <div className="video-details">
                            <span title={video.title} className="video-title-text" style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'block',
                                transition: "color 0.3s ease"
                            }}>
                                {video.title}
                            </span>
                            <span className='video-meta video-channel'>{video.channel.fullname}</span>
                            <span className='video-meta video-stats'>{video.views} views • {time}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default VideoCard;
