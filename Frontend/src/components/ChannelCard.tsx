import React from 'react'
import { Link } from 'react-router-dom';
import "../cssfiles/DashboardStyles.css";
import defaultimg from "../assets/user-avatar.png";
const ChannelCard: React.FC<{ id: string, channelName: string, imageURL: string }> = ({ id, channelName, imageURL }) => {

    return (
        <Link title={channelName} className="Subscription-dropdown-item" to={`/dashboard/profile/${channelName}/${id}`}>
            <img
                src={imageURL || defaultimg}
                alt="Channel Avatar"
                className="avatar"
                style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    outlineOffset: "2px",
                    outline: "1px solid #ccc",
                }}
                tabIndex={-1} />
            <span
                className="sidebar-text-channel">
                {channelName}
            </span>
        </Link>
    )
}

export default ChannelCard;
