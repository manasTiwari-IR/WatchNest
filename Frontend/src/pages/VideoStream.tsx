import React from 'react'
import { useParams } from 'react-router-dom';

const VideoStream = () => {
    const { channelname, videoid } = useParams<{ channelname: string, videoid: string }>();
    return (
        <>
            <h1>Video Stream</h1>
            <p>Channel Name: {channelname}</p>
            <p>Video ID: {videoid}</p>
        </>
    )
}

export default VideoStream;

