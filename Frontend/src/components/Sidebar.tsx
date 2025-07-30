import React, { useEffect } from 'react'
import "../cssfiles/DashboardStyles.css";
import ChannelCard from './ChannelCard.tsx';
import Footer from '../components/Footer.tsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useToaster, Message } from 'rsuite';
import { useSelector } from 'react-redux';
import useCustomHooks from "../functions/CustomHook";

interface SubscribedChannelsResponse {
    _id: string;
    channel: {
        _id: string;
        fullname: string;
        username: string;
        avatar: string[];
    }
}
const Sidebar: React.FC = () => {
    const toaster = useToaster();
    const { decryptData } = useCustomHooks();   //decryptData function from custom hook
    const [subscribedChannelData, setSubscribedChannelData] = useState<SubscribedChannelsResponse[] | null>(null);
    const [userId, setuserId] = useState<string | null>(null);
    const data: string = useSelector((state: any) => state.userData.data);
    const key: string = useSelector((state: any) => state.userData.key);

    useEffect(() => {
        if (data && key) {
            decryptData(data, key)
                .then((res: any) => {
                    setuserId(res._id);
                })
                .catch((error: any) => {
                    console.error("Error decrypting data: ", error);
                });
        }
    }, [data, key]);
    const api_url = import.meta.env.VITE_api_URL;
    const getSubscribedChannels = async () => {
        // console.log("Fetching subscribed channels for user ID:", userId);
        try {
            if (subscribedChannelData !== null) return;
            const response = await fetch(`${api_url}/api/v1/subscriptions/u/${userId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                //     console.log("response = ",response);
                throw new Error(response.statusText);
            }
            const data = await response.json();
            setSubscribedChannelData(data.data.subscribedChannels);
            // console.log("Subscribed channels data:", data);

        } catch (error) {
            console.error("Error fetching subscribed channels:", error);
            // Handle error (e.g., show notification)
            toaster.push(
                (<Message showIcon closable type="error" header="Internal Server Error"
                    style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                    Error: Unable to fetch subscribed channels. Please try again later.
                </Message>),
                { placement: 'topEnd', duration: 1500 }
            );
            setSubscribedChannelData(null); // Reset state on error
            return;
        }
    };
    useEffect(() => {
        if (userId) {
            getSubscribedChannels();
        }
    }, [userId])

    // console.log("Subscribed Channel Data1:", subscribedChannelData);
    const [isSelected, setSelected] = useState<number>(1);
    useEffect(() => {
        if (window.location.pathname === "/dashboard/playlists") {
            setSelected(2);
        }
        else if (window.location.pathname === "/dashboard/your-videos") {
            setSelected(3);
        }
        else if (window.location.pathname === "/dashboard/history") {
            setSelected(4);
        }
        else if (window.location.pathname === "/dashboard/liked-videos") {
            setSelected(5);
        }
        else {
            setSelected(1);
        }
    }, []);

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
            <Link className={isSelected === 5 ? "sidebar-btn sidebar-active" : "sidebar-btn"} to="/dashboard/liked-videos" onClick={() => setSelected(5)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none">
                        <path fill="currentColor" d="m15 10l-.74-.123a.75.75 0 0 0 .74.873zM4 10v-.75a.75.75 0 0 0-.75.75zm16.522 2.392l.735.147zM6 20.75h11.36v-1.5H6zm12.56-11.5H15v1.5h3.56zm-2.82.873l.806-4.835l-1.48-.247l-.806 4.836zm-.92-6.873h-.214v1.5h.213zm-3.335 1.67L8.97 8.693l1.248.832l2.515-3.773zM7.93 9.25H4v1.5h3.93zM3.25 10v8h1.5v-8zm16.807 8.54l1.2-6l-1.47-.295l-1.2 6zM8.97 8.692a1.25 1.25 0 0 1-1.04.557v1.5c.92 0 1.778-.46 2.288-1.225zm7.576-3.405A1.75 1.75 0 0 0 14.82 3.25v1.5a.25.25 0 0 1 .246.291zm2.014 5.462c.79 0 1.38.722 1.226 1.495l1.471.294A2.75 2.75 0 0 0 18.56 9.25zm-1.2 10a2.75 2.75 0 0 0 2.697-2.21l-1.47-.295a1.25 1.25 0 0 1-1.227 1.005zm-2.754-17.5a3.75 3.75 0 0 0-3.12 1.67l1.247.832a2.25 2.25 0 0 1 1.873-1.002zM6 19.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 6 20.75z" />
                        <path stroke="currentColor" strokeWidth="1.5" d="M8 10v10" />
                    </g>
                </svg>
                <span className="sidebar-text">Liked Videos</span>
            </Link>

            <div className="Subscription-dropdown m-0 p-0 w-full">
                <button className={`sidebar-btn subs-btn w-full ${isSubscriptionOpen ? "clicked" : ""}`}
                    onClick={() => {
                        setSubscriptionOpen(!isSubscriptionOpen);
                        if (subscribedChannelData === null && !isSubscriptionOpen) {
                            getSubscribedChannels();
                        }
                    }} >
                    <span className="sidebar-text">Subscriptions</span>
                    {isSubscriptionOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>}
                </button>
                <div
                    className={`Subscription-dropdown-menu transition-all duration-200 ease-in-out overflow-hidden ${isSubscriptionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`transform transition-transform duration-200 ${isSubscriptionOpen ? 'translate-y-0' : '-translate-y-4'}`}>
                        {subscribedChannelData && subscribedChannelData.length > 0 ? (
                            subscribedChannelData.map((channel, index) => (
                                <ChannelCard key={index} id={channel.channel._id} channelName={channel.channel.fullname} imageURL={channel.channel.avatar[0]} />
                            ))
                        ) : (
                            <p className="text-gray-500 p-2 text-center text-[12px]">No subscribed channels found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer styles={{ backgroundColor: "transparent", borderTop: "1px solid #333" }} />
        </aside>
    );
}

export default Sidebar
