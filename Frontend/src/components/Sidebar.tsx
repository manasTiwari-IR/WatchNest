import React from 'react'
import Footer from '../components/Footer.tsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Sidebar: React.FC = () => {
    const [isSelected, setSelected] = useState(1);
    const [isSubscriptionOpen, setSubscriptionOpen] = useState(false);
    return (
        <aside className="sidebar">
            <Link className={isSelected === 1 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard" onClick={() => setSelected(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                <span className="sidebar-text">Home</span>
            </Link>
            <Link className={isSelected === 2 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard/playlists" onClick={() => setSelected(2)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-video-icon lucide-list-video"><path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" /><path d="m16 12 5 3-5 3v-6Z" /></svg>
                <span className="sidebar-text">Playlists</span>
            </Link>
            <Link className={isSelected === 3 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard/your-videos" onClick={() => setSelected(3)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-play-icon lucide-square-play"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 8 6 4-6 4Z" /></svg>
                <span className="sidebar-text">Your Videos</span>
            </Link>
            <Link className={isSelected === 4 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard/history" onClick={() => setSelected(4)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history-icon lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
                <span className="sidebar-text">History</span>
            </Link>

            <div className="Subscription-dropdown m-0 p-0 w-full">
                <button className={`sidebar-btn subs-btn w-full ${isSubscriptionOpen ? "clicked" : ""}`}
                    onClick={() => setSubscriptionOpen(!isSubscriptionOpen)}
                >
                    <span className="sidebar-text">Subscriptions</span>
                    {isSubscriptionOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>}
                </button>
                <div className="Subscription-dropdown-menu"
                    hidden={!isSubscriptionOpen}
                >
                    <Link className="Subscription-dropdown-item" to="/channel1-profile">
                        <img
                            src="https://avatar.iran.liara.run/username?username=Lara+James&length=2"
                            // src={channel-name || "../src/assets/user-avatar.png"}
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
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <Footer styles={{ backgroundColor: "transparent", borderTop: "1px solid #333" }} />
        </aside>
    );
}

export default Sidebar
