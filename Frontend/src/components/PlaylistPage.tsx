import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToaster, Message } from 'rsuite';
import { Suspense, lazy } from 'react';
const PlaylistVideoCard = lazy(() => import('./ProfileContentCardVideos.tsx'));

interface PlaylistDetails {
    _id: string;
    name: string;
    description: string;
}

interface PlaylistVideo {
    _id: string;
    title: string;
    thumbnail: string;
    views: number;
    duration: number;
    createdAt: string;
    owner: string;
}

const PlaylistPage: React.FC = () => {
    const initPlaylistDetails: PlaylistDetails = {
        _id: '',
        name: '',
        description: ''
    };
    const { playlistid } = useParams<{ playlistid: string }>();
    const [playlistVideos, setPlaylistVideos] = useState<PlaylistVideo[]>([]);
    const [playlistDetails, setPlaylistDetails] = useState<PlaylistDetails>(initPlaylistDetails);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const toaster = useToaster();
    const apiURL = import.meta.env.VITE_api_URL;

    const fetchPlaylistDetails = async () => {
        const constroller = new AbortController();
        const timeoutId = setTimeout(() => {
            constroller.abort();
        }, 15000); // Abort request after 15 seconds
        try {
            const response = await fetch(`${apiURL}/api/v1/playlists/${playlistid}`, {
                method: 'GET',
                signal: constroller.signal,
                credentials: 'include'
            });
            clearTimeout(timeoutId); // Clear timeout if request is successful
            if (response.ok) {
                const data = await response.json();
                // console.log("Playlist details fetched successfully:", data);
                setPlaylistDetails(data.data);
                setPlaylistVideos(data.data.videos);
                setIsOwner(data.data.isOwner);
            } else {
                console.error("Failed to fetch playlist details:", response.statusText);
                toaster.push(
                    <Message type="error" showIcon>
                        Error fetching playlist details. Please try again.
                    </Message>,
                    { placement: 'topEnd', duration: 2000 }
                );
                throw new Error(`Error fetching playlist details: ${response.statusText}`);
            }
        } catch (error) {
            clearTimeout(timeoutId); // Clear timeout if request fails
            console.error("Error fetching playlist details: ", error);
            toaster.push(
                <Message type="error" showIcon>
                    Error fetching playlist details. Please try again.
                </Message>,
                { placement: 'topEnd', duration: 2000 }
            );
            setError(true);
            throw error; // Re-throw the error to be handled by the calling function
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchPlaylistDetails();
            } catch (error) {
                console.error("Error in useEffect: ", error);
                setError(true);
                throw error;
            }
        };
        fetchData();
    }, []);

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100vh',
                width: '100%',
            }}
            >
                <h1 style={{
                    textAlign: 'center',
                    color: '#333',
                    fontSize: '1.5rem',
                    marginTop: '20px'
                }} >Error</h1>
                <p style={{
                    color: '#333',
                    textAlign: 'center',
                    fontSize: '1rem'
                }}>Playlist Not found or There was an error fetching the playlist details. Please try again later.</p>
            </div >
        );
    }

    return (
        <section className="playlist-page-container">
            <h1 className="playlist-videos-title">{playlistDetails.name}</h1>
            <p className="playlist-videos-description">{playlistDetails.description}</p>
            <div className="playlist-videos-container">
                {playlistVideos.length === 0 && (
                    <p className="no-videos-message">No videos found in this playlist.</p>
                )}
                {playlistVideos.length > 0 && playlistVideos.map(video => (
                    <Suspense key={video._id} fallback={
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                            <div style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                            }}>
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    }>
                        <PlaylistVideoCard id={video._id} title={video.title} createdAt={video.createdAt} views={video.views} duration={video.duration} playlistid={playlistid}
                            channelid={video.owner} thumbnail={video.thumbnail}
                            hideVideodeleteFromPlaylist={!isOwner}
                            hidedropdown={true} setVideoData={() => { }} setPlaylistVideos={setPlaylistVideos} />
                    </Suspense>
                ))}
            </div>

        </section>
    )
};
export default PlaylistPage;
