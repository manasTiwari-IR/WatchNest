import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import useCustomHooks from "../functions/CustomHook";
import { useNavigate } from "react-router-dom";
import ChannelCard from "./ChannelCard.tsx";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setuserData] = useState<any>({});
  const data: string = useSelector((state: any) => state.userData.data);
  const key: string = useSelector((state: any) => state.userData.key);
  const { decryptData } = useCustomHooks();   //decryptData function from custom hook

  useEffect(() => {
    //console.log("useEffect called in Navbar");
    // setTimeout(() => {
    //   console.log("Decrypting data in Navbar");
    if (data && key) {
      decryptData(data, key)
        .then((res: any) => {
          setuserData(res);
        })
        .catch((error: any) => {
          console.error("Error decrypting data: ", error);
        });
    }
    // }, 3000);
  }, [data, key]);

  // console.log("userData: ", userData);
  // console.log("userData avatar: ", userData.avatar);

  const splitName: string[] = userData?.fullname?.split(" ");
  // console.log("splitName: ", splitName);
  const userAvatarUrl: string | undefined = (splitName && splitName.length > 0)
    ? (splitName && splitName.length > 1)
      ? `${splitName[0][0]}${splitName[1][0]}`
      : `${splitName[0][0]}`
    : undefined;
  // console.log("URL : ", userAvatarUrl);

  const [isSubscriptionOpen, setSubscriptionOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = React.useState(false);

  const handleLogOut = async () => {
    // TODO - Add logout functionality
    console.log("Logout clicked");
    try {
      await fetch("http://localhost:8001/api/v1/users/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
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
          <button className="avatar-dropdown" onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
            style={{ outlineOffset: isAvatarDropdownOpen ? "0" : "" }} >
            {/* <img
              src={userAvatarUrl}
              // https://avatar.iran.liara.run/username?username=[firstname+lastname]&length=[1-2]
              // if Last name is not there, length will be 1
              alt=""
              className="avatar"
              tabIndex={-1}
            /> */}
            {
              userData?.avatar?.length > 0 ?
                <img
                  src={userData?.avatar[0]}
                  style={{ appearance: "none" }}
                  alt=""
                  className="avatar"
                  tabIndex={-1}
                />
                :
                userAvatarUrl ?

                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-200 rounded-full" >
                    <span className="font-bold text-[16px] text-gray-600 ">
                      {userAvatarUrl}</span>
                  </div>
                  : <img
                    src="../src/assets/user-avatar.png"
                    style={{ appearance: "none" }}
                    alt=""
                    className="avatar"
                    tabIndex={-1}
                  />
            }
          </button>
          <div
            className={`dropdown-menu transition-all duration-200 ease-in-out ${isAvatarDropdownOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[-10px] pointer-events-none"
              }`}
          >
            <div className="user-info">
              <strong>{userData.fullname}</strong>
              <div className="email-userinfo">{userData.email}</div>
            </div>
            <hr />
            <button className="dropdown-item" onClick={() => navigate("/dashboard/profile/" + userData?.username + "/" + userData?._id)}>Profile</button>
            <button className="dropdown-item" onClick={() => handleLogOut()}>Logout</button>
          </div>
        </div >
      </nav >

      {/* Drawer for mobile */}
      < div className="drawer" style={{ display: isDrawerOpen ? "block" : "none" }} tabIndex={- 1} onClick={() => setIsDrawerOpen(false)}>
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
              <div
                className={`Subscription-dropdown-menu transition-all duration-200 ease-in-out overflow-hidden ${isSubscriptionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`transform transition-transform duration-200 ${isSubscriptionOpen ? 'translate-y-0' : '-translate-y-4'}`}>
                  <ChannelCard channelName="Star Gaming" imageURL="" />
                  <ChannelCard channelName="MovieFilx" imageURL="" />
                  <ChannelCard channelName="Widlife Channel" imageURL="" />
                </div>
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
