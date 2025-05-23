import "../cssfiles/DashboardStyles.css"
import { Link } from "react-router-dom";
import React from "react";
import Footer from "../components/Footer.tsx";
import { useState } from "react";

const Dashboard: React.FC = () => {
    const userAvatar: string | undefined = "https://avatar.iran.liara.run/username?username=John+Doe&length=2";
    const [isSelected, setSelected] = useState(1);
    const [isSubscriptionOpen, setSubscriptionOpen] = useState(false);
    return (
        <>
            <div className="dashboard-container">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-left">
                        <button className="hamburger" aria-label="Open menu" hidden={true}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu"><path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" /></svg>
                        </button>
                        <Link to="/dashboard" className="logo-link" >
                            <img src="../src/assets/android-chrome-192x192.png" alt="Logo" className="logo" />
                            <span className="brand">VIDTUBE</span>
                        </Link>
                    </div>
                    <div className="navbar-center">
                        <div className="m-0 p-0 rounded-[20px]"
                            style={{
                                position: "relative"
                            }}>
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search videos..."
                            />
                            <span className="searchbar-icon" aria-label="Search"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "90%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                }}>
                                <svg width="24" height="24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" /></svg>
                            </span>
                        </div>
                    </div>
                    <div className="navbar-right">
                        <button className="search-icon" aria-label="Search">
                            <svg width="24" height="24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" /></svg>
                        </button>
                        <button className="upload-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus">
                                <path d="M5 12h14" /><path d="M12 5v14" />
                            </svg>
                            <span className="upload-text">Upload</span>
                        </button>
                        <div className="avatar-dropdown">
                            <img
                                src={userAvatar || "../src/assets/user-avatar.png"}
                                // https://avatar.iran.liara.run/username?username=[firstname+lastname]&length=[1-2]
                                // if Last name is not there, length will be 1
                                alt="User Avatar"
                                className="avatar"
                                tabIndex={-1}
                            />
                            <div className="dropdown-menu">
                                <div className="user-info">
                                    <strong>John Doe</strong>
                                    <div className="email">john@example.com</div>
                                </div>
                                <hr />
                                <button className="dropdown-item">Profile</button>
                                <button className="dropdown-item">Logout</button>
                            </div>
                        </div>
                    </div>
                </nav >

                {/* Drawer for mobile */}
                < div className="drawer" >
                    <div className="drawer-content">
                        <button className="close-drawer" aria-label="Close menu">&times;</button>
                        <div className="sidebar">
                            <button className="sidebar-btn">Home</button>
                            <button className="sidebar-btn">Trending</button>
                            <button className="sidebar-btn">Subscriptions</button>
                            <select className="sidebar-dropdown">
                                <option>Categories</option>
                                <option>Music</option>
                                <option>Sports</option>
                                <option>Gaming</option>
                            </select>
                        </div>
                    </div>
                </div >

                {/* Main Content */}
                < main className="main-content" >
                    <aside className="sidebar">
                        <Link className={isSelected === 1 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard" onClick={() => setSelected(1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                            <span className="sidebar-text">Home</span>
                        </Link>
                        <Link className={isSelected === 2 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard/" onClick={() => setSelected(2)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                            <span className="sidebar-text">Playlists</span>
                        </Link>
                        <Link className={isSelected === 3 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard" onClick={() => setSelected(3)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                            <span className="sidebar-text">Your Videos</span>
                        </Link>
                        <Link className={isSelected === 4 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard" onClick={() => setSelected(4)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                            <span className="sidebar-text">History</span>
                        </Link>

                        <div className="Subscription-dropdown m-0 p-0 w-full">
                            <button className={`sidebar-btn subs-btn w-full ${isSubscriptionOpen ? "clicked border-b-[1px] border-[#333]" : ""}`}
                                onClick={() => setSubscriptionOpen(!isSubscriptionOpen)}
                            >
                                <span className="sidebar-text">Subscriptions</span>
                                {isSubscriptionOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>}
                            </button>
                            <div className="Subscription-dropdown-menu"
                                hidden={!isSubscriptionOpen}
                            >
                                <button className="Subscription-dropdown-item">
                                    <img
                                        src={userAvatar || "../src/assets/user-avatar.png"}
                                        // https://avatar.iran.liara.run/username?username=[firstname+lastname]&length=[1-2]
                                        // if Last name is not there, length will be 1
                                        alt="Channel Avatar"
                                        className="avatar"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                        }}
                                        tabIndex={-1} />
                                    <span className="sidebar-text">Channel 1</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <Footer styles={{ backgroundColor: "transparent", borderTop: "1px solid #333" }} />
                    </aside>
                    <section className="video-feed">
                        <div className="videos-grid">
                            {[...Array(8)].map((_, i) => (
                                <div className="video-card" key={i}>
                                    <div className="video-thumb-wrapper" style={{ position: "relative" }}>
                                        <img
                                            src={`https://picsum.photos/seed/video${i}/320/180`}
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
                                                justifyContent: "center"
                                            }}
                                        >
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="white">
                                                {/* <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.3)" /> */}
                                                <polygon points="13,10 24,16 13,22" fill="white" />
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="video-info">
                                        <div className="video-title">Sample Video {i + 1}</div>
                                        <div className="video-meta">Channel Name • 1M views • 1 day ago</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main >
            </div >
        </>
    );
}

export default Dashboard
