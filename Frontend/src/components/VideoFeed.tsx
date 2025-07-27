import React, { use } from 'react'
import { useState, useEffect, useCallback, useRef } from "react";
import { Suspense, lazy } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";

const VideoCard = lazy(() => import('./VideoCard.tsx'));

interface ApiVideoResponse {
    _id: string;
    title: string;
    channel: {
        _id: string;
        fullname: string;
        avatar: string[];
    };
    thumbnail: string;
    keys: string[];
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
    const apiURL = import.meta.env.VITE_api_URL;

    const fetchVideos = useCallback(async (pageNumber: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiURL}/api/v1/videos?page=${pageNumber}&limit=10&sortBy=createdAt&sortType=desc`, {
                method: "GET",
                credentials: "include", // Include cookies in the request
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            // console.log("Fetched videos:", data);
            if (data.success) {
                if (data.data.length === 0) {
                    // console.log("No more videos to load");
                    // console.log(data.data.length);
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
                        <Suspense key={index} fallback={
                            <div role="status" className="max-w-sm p-4 rounded-sm shadow-sm animate-pulse md:p-6">
                                <div className="flex items-center justify-center h-48 mb-4 bg-gray-100 rounded-sm dark:bg-gray-200">
                                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    </svg>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full dark:bg-gray-200 w-48 mb-2.5"></div>
                                <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-200 mb-2.5"></div>

                                <span className="sr-only">Loading...</span>
                            </div>
                        }>
                            <VideoCard video={video} key={index} />
                        </Suspense>
                    ))}
                </div>

            </InfiniteScroll>
        </section>
    );
}

export default VideoFeed;
