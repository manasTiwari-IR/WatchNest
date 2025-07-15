import React from 'react'
import { Link } from 'react-router-dom';
import "../cssfiles/DashboardStyles.css";

const ChannelCard: React.FC<{ channelName: string, imageURL: string }> = ({ channelName, imageURL }) => {
    const userAvatarUrl: string = channelName
        .split(" ")
        .map(name => name.charAt(0).toUpperCase())
        .join("");
    if (imageURL === undefined || imageURL === null || imageURL === "") {
        imageURL = "";

    }
    return (
        <Link className="Subscription-dropdown-item" to="/dashboard/channel1-profile">
            {imageURL !== "" ?
                <img
                    src={imageURL || "../src/assets/user-avatar.png"}
                    // src={channel-name || "../src/assets/user-avatar.png"}
                    // https://avatar.iran.liara.run/username?username=[firstname+lastname]&length=[1-2]
                    // if Last name is not there, length will be 1
                    alt="..."
                    className="avatar"
                    style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                    }}
                    tabIndex={-1} />
                :
                <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-200 rounded-full" >
                    <span className="font-bold text-[16px] text-gray-600 ">
                        {userAvatarUrl}</span>
                </div>
            }
            <span
                className="sidebar-text-channel"

            >
                {channelName}
            </span>
        </Link>
    )
}

export default ChannelCard;
