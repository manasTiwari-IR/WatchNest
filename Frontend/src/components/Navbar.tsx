import { Link } from "react-router-dom";
import { useState } from "react";
import React from "react";
import Footer from "./Footer";

const Navbar: React.FC = () => {
  const userAvatar: string | undefined = "https://avatar.iran.liara.run/username?username=John+Doe&length=2";
  const [isSubscriptionOpen, setSubscriptionOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="hamburger" aria-label="Open menu" onClick={() => setIsDrawerOpen(true)} >
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
          <Link className="upload-btn" to="/upload" aria-label="Upload video">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
            <span className="upload-text">Upload</span>
          </Link>
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
      </nav>

      {/* Drawer for mobile */}
      <div className="drawer" style={{ display: isDrawerOpen ? "block" : "none" }} tabIndex={-1} onClick={() => setIsDrawerOpen(false)}>
        <div className="drawer-content" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
          <button className="close-drawer" aria-label="Close menu"
            onClick={() => setIsDrawerOpen(false)}
          >&times;</button>
          <div className="sidebar-drawer">
            {/* TODO - replace button - Link and add appropriate function  */}
            <Link className="sidebar-btn" to="/dashboard" onClick={() => setIsDrawerOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              <span className="sidebar-text">Home</span>
            </Link>
            <Link className="sidebar-btn" to="/dashboard/playlists" onClick={() => setIsDrawerOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-video-icon lucide-list-video"><path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" /><path d="m16 12 5 3-5 3v-6Z" /></svg>
              <span className="sidebar-text">Playlists</span>
            </Link>
            <Link className="sidebar-btn" to="/dashboard/your-videos" onClick={() => setIsDrawerOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-play-icon lucide-square-play"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 8 6 4-6 4Z" /></svg>
              <span className="sidebar-text">Your Videos</span>
            </Link>
            <Link className="sidebar-btn" to="/dashboard/history" onClick={() => setIsDrawerOpen(false)}>
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

          </div>
          <Footer styles={{ backgroundColor: "transparent", borderTop: "1px solid #333" }} />
        </div>
      </div >

    </>
  );
};

export default Navbar;
