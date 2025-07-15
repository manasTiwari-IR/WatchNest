import React, { use } from 'react'
import VideoCard from './VideoCard.tsx'
import { useState, useEffect, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

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

const VideoFeed: React.FC = () => {
    // const ref = useRef<HTMLDivElement>(null);
    const [videos, setVideos] = useState<ApiVideoResponse[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async (pageNumber: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8001/api/v1/videos?page=${pageNumber}&limit=10&sortBy=createdAt&sortType=desc`, {
                method: "GET",
                credentials: "include", // Include cookies in the request
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            // console.log("Fetched videos:", data.data[0].videos);
            if (data.success && Array.isArray(data.data[0].videos)) {
                if (data.data[0].videos.length === 0) {
                    setHasMore(false);
                } else {
                    setVideos(prev =>
                        pageNumber === 1
                            ? data.data[0].videos
                            : [...new Set([...prev, ...data.data[0].videos])]
                    );
                    setPage(pageNumber);
                }
            } else {
                throw new Error("Invalid response format");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch videos");
        } finally {
            setIsLoading(false);
        }
    }, []);
    // console.log("Videos:", videos);
    // console.log(typeof videos[0]?.duration);
    const loadMore = () => {
        if (!isLoading && hasMore) {
            fetchVideos(page + 1);
        }
    };

    useEffect(() => {
        fetchVideos(1);
    }, []);

    return (
        <section className="video-feed">
            {error && videos.length === 0 && (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={() => fetchVideos(1)} className="retry-button">
                        Retry
                    </button>
                </div>
            )}

            <InfiniteScroll
                dataLength={videos.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                    <div className='flex align-middle justify-center m-auto' >
                        <svg xmlns="http://www.w3.org/2000/svg" width={42} height={42} viewBox="0 0 24 24"><g fill="#000"><circle cx={12} cy={3.5} r={1.5}><animateTransform attributeName="transform" calcMode="discrete" dur="0.84s" repeatCount="indefinite" type="rotate" values="0 12 12;90 12 12;180 12 12;270 12 12"></animateTransform><animate attributeName="opacity" dur="0.21s" repeatCount="indefinite" values="1;1;0"></animate></circle><circle cx={12} cy={3.5} r={1.5} transform="rotate(30 12 12)"><animateTransform attributeName="transform" begin="0.07s" calcMode="discrete" dur="0.84s" repeatCount="indefinite" type="rotate" values="30 12 12;120 12 12;210 12 12;300 12 12"></animateTransform><animate attributeName="opacity" begin="0.07s" dur="0.21s" repeatCount="indefinite" values="1;1;0"></animate></circle><circle cx={12} cy={3.5} r={1.5} transform="rotate(60 12 12)"><animateTransform attributeName="transform" begin="0.14s" calcMode="discrete" dur="0.84s" repeatCount="indefinite" type="rotate" values="60 12 12;150 12 12;240 12 12;330 12 12"></animateTransform><animate attributeName="opacity" begin="0.14s" dur="0.21s" repeatCount="indefinite" values="1;1;0"></animate></circle></g></svg>
                    </div>
                }
                endMessage={<p className="end-message"
                    style={{
                        textAlign: "center",
                        margin: "10px 0 10px 0",
                        fontSize: "14px",
                        color: "#555"
                    }}
                >You've seen all videos!</p>}
            >
                <div className="videos-grid">
                    {videos.map((video, index) => (
                        <VideoCard key={index} video={video} />
                    ))}
                </div>
            </InfiniteScroll>
        </section>
    );
}

export default VideoFeed;
