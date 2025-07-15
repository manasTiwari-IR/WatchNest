import React from 'react'
import { Link } from 'react-router-dom'
import useCustomHooks from '../functions/CustomHook.ts';
import '../cssfiles/DashboardStyles.css'

interface ApiVideoResponse {
    _id: string;
    title: string;
    channel: {
        id: string;
        fullname: string;
        avatar: string[];
    };
    thumbnail: string;
    views: number;
    duration?: number;
    createdAt?: string;
}

const VideoCard: React.FC<{ video: ApiVideoResponse }> = ({ video }) => {
    const { formatYouTubeDate } = useCustomHooks();
    const time = video.createdAt ? formatYouTubeDate(video.createdAt) : "Unknown";
    return (
        <>
            <Link className="video-card" to={`/video/${video.channel.fullname}/${video._id}`}>
                <div className="video-thumb-wrapper">
                    <img
                        src={video?.thumbnail || "../src/assets/default_thumbnail.png"}
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
                            transition: "opacity 0.3s ease",
                            justifyContent: "center",
                            width: "38px",
                            height: "38px",
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                            {/* <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.3)" /> */}
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
                            fontWeight: "500"
                        }}
                    >
                        {Math.floor(video?.duration ? video?.duration / 60 : 0)}:{Math.floor(video?.duration ? video?.duration % 60 : 0)}

                    </span>
                </div>
                <div className="video-info">
                    <div className="video-title">
                        <img
                            src={video?.channel?.avatar[0] || "../src/assets/user-avatar.png"}
                            // https://avatar.iran.liara.run/username?username=[firstname+lastname]&length=[1-2]
                            // if Last name is not there, length will be 1
                            alt="User Avatar"
                            className="avatar channel-avatar"
                        />
                        <div className="video-details">
                            <span className="video-title-text" style={{
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'block'
                            }}>
                                {video.title} </span>
                            <span className='video-meta video-channel'>{video.channel.fullname}</span>
                            <span className='video-meta video-stats'>{video.views} views • {time}</span>
                        </div>
                    </div>
                </div>
            </Link >
        </>
    )
}

export default VideoCard;
