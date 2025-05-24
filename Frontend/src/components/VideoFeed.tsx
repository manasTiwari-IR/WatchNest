import React from 'react'
import { Link } from 'react-router-dom'

const VideoFeed: React.FC = () => {
    return (
        <section className="video-feed">
            <div className="videos-grid">
                {[...Array(8)].map((_, i) => (
                    <Link className="video-card" key={i} to={`/video/${i}`}>
                        <div className="video-thumb-wrapper">
                            <img
                                src={`https://picsum.photos/seed/video${i}/320/320`}
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

                        </div>
                        <div className="video-info">
                            <div className="video-title">
                                <img
                                    src={"../src/assets/user-avatar.png"}
                                    // https://avatar.iran.liara.run/username?username=[firstname+lastname]&length=[1-2]
                                    // if Last name is not there, length will be 1
                                    alt="User Avatar"
                                    className="avatar channel-avatar"
                                />
                                <span className="video-title-text">
                                    Video Title {i + 1}
                                </span>
                            </div>
                            <div className="video-meta">
                                <span className='video-channel'>Channel Name</span>
                                <span className='video-stats'>1.2K views • 2 days ago</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section >
    );
}

export default VideoFeed
