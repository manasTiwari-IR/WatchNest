import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToaster, Message } from 'rsuite';
import useCustomHooks from '../functions/CustomHook';
import Navbar from '../components/Navbar';
import '../cssfiles/VideoStreamPage.css';
import defaultUserAvatar from '../assets/user-avatar.png';

// Define interfaces for our data types
interface VideoDetails {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: {
    _id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
    avatar?: string;
  };
  createdAt: string;
}

const VideoStream: React.FC = () => {
  // Get video ID and channel ID from URL params
  const { videoId , channelId } = useParams<{ videoId: string , channelId: string }>();
  const toaster = useToaster();
  
  // State for various data
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [subscribeButtonLoading, setSubscribeButtonLoading] = useState<boolean>(false);
  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [videoQuality, setVideoQuality] = useState<string>("Auto");
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);

  // User data from redux store
  const [userData, setUserData] = useState<any>(null);
  const data = useSelector((state: any) => state.userData.data);
  const key = useSelector((state: any) => state.userData.key);
  const { decryptData } = useCustomHooks();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const apiUrl = import.meta.env.VITE_api_URL;

  // Fetch user data from redux store
  useEffect(() => {
    if (data && key) {
      decryptData(data, key)
        .then((res: any) => {
          setUserData(res);
        })
        .catch((error: any) => {
          console.error("Error decrypting user data: ", error);
        });
    }
  }, [data, key, decryptData]);

  // Fetch video details when component mounts or videoId changes
  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      fetch(`${apiUrl}/api/v1/videos/${videoId}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch video details');
          }
          return response.json();
        })
        .then(data => {
          setVideoDetails(data.data);
          checkLikeStatus(data.data._id);
          checkSubscriptionStatus(data.data.owner._id);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching video details:', error);
          toaster.push(
            <Message type="error" closable>
              Error loading video. Please try again.
            </Message>
          );
          setIsLoading(false);
        });
    }
  }, [videoId, apiUrl, toaster]);

  // Fetch comments when video details are loaded
  useEffect(() => {
    if (videoDetails) {
      setIsCommentsLoading(true);
      fetch(`${apiUrl}/api/v1/comments/${videoDetails._id}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch comments');
          }
          return response.json();
        })
        .then(data => {
          setComments(data.data);
          setIsCommentsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
          setIsCommentsLoading(false);
        });
    }
  }, [videoDetails, apiUrl]);

  // Fetch user playlists
  useEffect(() => {
    if (userData) {
      fetch(`${apiUrl}/api/v1/playlists/user/${userData._id}`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch playlists');
          }
          return response.json();
        })
        .then(data => {
          setPlaylists(data.data);
        })
        .catch(error => {
          console.error('Error fetching playlists:', error);
        });
    }
  }, [userData, apiUrl]);
  
  // Fetch recommended videos
  useEffect(() => {
    if (videoDetails) {
      fetch(`${apiUrl}/api/v1/videos/recommendations/${videoDetails._id}?limit=6`, {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
          }
          return response.json();
        })
        .then(data => {
          setRecommendedVideos(data.data);
        })
        .catch(error => {
          console.error('Error fetching recommended videos:', error);
        });
    }
  }, [videoDetails, apiUrl]);

  // Check if user has liked the video
  const checkLikeStatus = (videoId: string) => {
    if (!userData) return;
    
    fetch(`${apiUrl}/api/v1/likes/videos/${videoId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to check like status');
        }
        return response.json();
      })
      .then(data => {
        setIsLiked(data.data.isLiked);
        setLikesCount(data.data.likesCount);
      })
      .catch(error => {
        console.error('Error checking like status:', error);
      });
  };

  // Check if user is subscribed to the channel
  const checkSubscriptionStatus = (channelId: string) => {
    if (!userData) return;
    
    fetch(`${apiUrl}/api/v1/subscriptions/c/${channelId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to check subscription status');
        }
        return response.json();
      })
      .then(data => {
        setIsSubscribed(data.data.isSubscribed);
      })
      .catch(error => {
        console.error('Error checking subscription status:', error);
      });
  };

  // Toggle like status
  const toggleLike = () => {
    if (!userData) {
      toaster.push(
        <Message type="info" closable>
          Please log in to like videos
        </Message>
      );
      return;
    }

    if (!videoDetails) return;
    
    fetch(`${apiUrl}/api/v1/likes/toggle/v/${videoDetails._id}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to toggle like');
        }
        return response.json();
      })
      .then(data => {
        setIsLiked(data.data.isLiked);
        setLikesCount(prev => data.data.isLiked ? prev + 1 : prev - 1);
      })
      .catch(error => {
        console.error('Error toggling like:', error);
        toaster.push(
          <Message type="error" closable>
            Error updating like status
          </Message>
        );
      });
  };

  // Toggle subscription status
  const toggleSubscription = () => {
    if (!userData) {
      toaster.push(
        <Message type="info" closable>
          Please log in to subscribe to channels
        </Message>
      );
      return;
    }

    if (!videoDetails) return;
    setSubscribeButtonLoading(true);
    
    fetch(`${apiUrl}/api/v1/subscriptions/c/${videoDetails.owner._id}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to toggle subscription');
        }
        return response.json();
      })
      .then(data => {
        setIsSubscribed(data.data.isSubscribed);
        setSubscribeButtonLoading(false);
      })
      .catch(error => {
        console.error('Error toggling subscription:', error);
        toaster.push(
          <Message type="error" closable>
            Error updating subscription status
          </Message>
        );
        setSubscribeButtonLoading(false);
      });
  };

  // Add video to playlist
  const addToPlaylist = (playlistId: string) => {
    if (!videoDetails) return;
    
    fetch(`${apiUrl}/api/v1/playlists/add/${playlistId}/${videoDetails._id}`, {
      method: 'PATCH',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add to playlist');
        }
        return response.json();
      })
      .then(data => {
        toaster.push(
          <Message type="success" closable>
            Video added to playlist
          </Message>
        );
        setShowPlaylistModal(false);
      })
      .catch(error => {
        console.error('Error adding to playlist:', error);
        toaster.push(
          <Message type="error" closable>
            Error adding video to playlist
          </Message>
        );
      });
  };

  // Add new comment
  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !userData || !videoDetails) {
      return;
    }

    fetch(`${apiUrl}/api/v1/comments/${videoDetails._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
        return response.json();
      })
      .then(data => {
        setComments(prev => [data.data, ...prev]);
        setNewComment('');
        if (commentInputRef.current) {
          commentInputRef.current.style.height = 'auto';
        }
      })
      .catch(error => {
        console.error('Error adding comment:', error);
        toaster.push(
          <Message type="error" closable>
            Error adding comment
          </Message>
        );
      });
  };

  // Format view count
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  // Auto-resize comment input
  const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (isLoading) {
    return (
      <div className="Video-Stream-loading-container">
        <div className="Video-Stream-loader"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (!videoDetails) {
    return (
      <div className="Video-Stream-error-container">
        <h2>Video not found</h2>
        <p>The video you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="Video-Stream-back-home-link">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="Video-Stream-video-stream-page">
      <Navbar />
      
      <div className="Video-Stream-video-content-container">
        <div className="Video-Stream-video-player-section">
          {/* Video Player */}
          <div className="Video-Stream-video-player">
            <video 
              ref={videoRef}
              // Use actual video file and thumbnail when available
              src={videoDetails.videoFile || 'null'} 
              poster={videoDetails.thumbnail || 'null'}
              controls 
              autoPlay
              className="Video-Stream-video-element"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            <div className="Video-Stream-center-controls">
              <button 
                className="Video-Stream-play-pause-button"
                onClick={() => {
                  if (videoRef.current) {
                    if (isVideoPlaying) {
                      videoRef.current.pause();
                      setIsVideoPlaying(false);
                    } else {
                      videoRef.current.play();
                      setIsVideoPlaying(true);
                    }
                  }
                }}
              >
                {isVideoPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
            </div>
            
            <div className="Video-Stream-player-controls">
              <div className="Video-Stream-speed-selector">
                <button className="Video-Stream-speed-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{playbackSpeed === 1 ? 'Normal' : playbackSpeed + 'x'}</span>
                </button>
                <div className="Video-Stream-speed-dropdown">
                  <button 
                    className={`Video-Stream-speed-option ${playbackSpeed === 0.25 ? 'active' : ''}`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.playbackRate = 0.25;
                        setPlaybackSpeed(0.25);
                      }
                    }}
                  >
                    0.25x
                  </button>
                  <button 
                    className={`Video-Stream-speed-option ${playbackSpeed === 0.5 ? 'active' : ''}`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.playbackRate = 0.5;
                        setPlaybackSpeed(0.5);
                      }
                    }}
                  >
                    0.5x
                  </button>
                  <button 
                    className={`Video-Stream-speed-option ${playbackSpeed === 0.75 ? 'active' : ''}`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.playbackRate = 0.75;
                        setPlaybackSpeed(0.75);
                      }
                    }}
                  >
                    0.75x
                  </button>
                  <button 
                    className={`Video-Stream-speed-option ${playbackSpeed === 1 ? 'active' : ''}`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.playbackRate = 1;
                        setPlaybackSpeed(1);
                      }
                    }}
                  >
                    Normal
                  </button>
                  <button 
                    className={`Video-Stream-speed-option ${playbackSpeed === 1.25 ? 'active' : ''}`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.playbackRate = 1.25;
                        setPlaybackSpeed(1.25);
                      }
                    }}
                  >
                    1.25x
                  </button>
                  <button 
                    className={`Video-Stream-speed-option ${playbackSpeed === 1.5 ? 'active' : ''}`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.playbackRate = 1.5;
                        setPlaybackSpeed(1.5);
                      }
                    }}
                  >
                    1.5x
                  </button>
                  <button 
                    className={`Video-Stream-speed-option ${playbackSpeed === 2 ? 'active' : ''}`}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.playbackRate = 2;
                        setPlaybackSpeed(2);
                      }
                    }}
                  >
                    2x
                  </button>
                </div>
              </div>
              <div className="Video-Stream-quality-selector">
                <button className="Video-Stream-quality-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>{videoQuality}</span>
                </button>
                <div className="Video-Stream-quality-dropdown">
                  <button 
                    className={`Video-Stream-quality-option ${videoQuality === "Auto" ? "active" : ""}`}
                    onClick={() => {
                      // In a real implementation, this would switch to auto quality
                      setVideoQuality("Auto");
                      toaster.push(
                        <Message type="info" closable>
                          Quality set to Auto
                        </Message>
                      );
                    }}
                  >
                    Auto
                  </button>
                  <button 
                    className={`Video-Stream-quality-option ${videoQuality === "1080p" ? "active" : ""}`}
                    onClick={() => {
                      // In a real implementation, this would switch to 1080p quality
                      setVideoQuality("1080p");
                      toaster.push(
                        <Message type="info" closable>
                          Quality set to 1080p
                        </Message>
                      );
                    }}
                  >
                    1080p
                  </button>
                  <button 
                    className={`Video-Stream-quality-option ${videoQuality === "720p" ? "active" : ""}`}
                    onClick={() => {
                      // In a real implementation, this would switch to 720p quality
                      setVideoQuality("720p");
                      toaster.push(
                        <Message type="info" closable>
                          Quality set to 720p
                        </Message>
                      );
                    }}
                  >
                    720p
                  </button>
                  <button 
                    className={`Video-Stream-quality-option ${videoQuality === "480p" ? "active" : ""}`}
                    onClick={() => {
                      // In a real implementation, this would switch to 480p quality
                      setVideoQuality("480p");
                      toaster.push(
                        <Message type="info" closable>
                          Quality set to 480p
                        </Message>
                      );
                    }}
                  >
                    480p
                  </button>
                  <button 
                    className={`Video-Stream-quality-option ${videoQuality === "360p" ? "active" : ""}`}
                    onClick={() => {
                      // In a real implementation, this would switch to 360p quality
                      setVideoQuality("360p");
                      toaster.push(
                        <Message type="info" closable>
                          Quality set to 360p
                        </Message>
                      );
                    }}
                  >
                    360p
                  </button>
                  <button 
                    className={`Video-Stream-quality-option ${videoQuality === "240p" ? "active" : ""}`}
                    onClick={() => {
                      // In a real implementation, this would switch to 240p quality
                      setVideoQuality("240p");
                      toaster.push(
                        <Message type="info" closable>
                          Quality set to 240p
                        </Message>
                      );
                    }}
                  >
                    240p
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="Video-Stream-video-info">
            <h1 className="Video-Stream-video-title">{videoDetails.title}</h1>
            
            <div className="Video-Stream-video-stats">
              <div className="Video-Stream-views-date">
                <span className="Video-Stream-views">{formatViews(videoDetails.views)} views</span>
                <span className="Video-Stream-date">{formatDate(videoDetails.createdAt)}</span>
              </div>
              
              <div className="Video-Stream-video-actions">
                <button 
                  className={`Video-Stream-action-button Video-Stream-like-button ${isLiked ? 'active' : ''}`}
                  onClick={toggleLike}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                  </svg>
                  <span>{likesCount}</span>
                </button>
                
                <button 
                  className="Video-Stream-action-button Video-Stream-playlist-button"
                  onClick={() => setShowPlaylistModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"></path>
                    <path d="M19 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"></path>
                    <path d="M5 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"></path>
                  </svg>
                  <span>Save</span>
                </button>
                
                <button 
                  className="Video-Stream-action-button Video-Stream-share-button"
                  onClick={() => setShowShareModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="Video-Stream-channel-info">
            <div className="Video-Stream-channel-details">
              <Link to={`/profile/${videoDetails.owner.username}/${videoDetails.owner._id}`} className="Video-Stream-channel-avatar-link">
                <img 
                  src={videoDetails.owner.avatar || defaultUserAvatar} 
                  alt={videoDetails.owner.fullname} 
                  className="Video-Stream-channel-avatar" 
                />
              </Link>
              
              <div className="Video-Stream-channel-text">
                <Link to={`/profile/${videoDetails.owner.username}/${videoDetails.owner._id}`} className="Video-Stream-channel-name">
                  {videoDetails.owner.fullname}
                </Link>
                <span className="Video-Stream-channel-username">@{videoDetails.owner.username}</span>
              </div>
            </div>
            
            <button 
              className={`Video-Stream-subscribe-button ${isSubscribed ? 'subscribed' : ''}`}
              onClick={toggleSubscription}
              disabled={subscribeButtonLoading}
            >
              {subscribeButtonLoading ? (
                <span className="Video-Stream-button-loader"></span>
              ) : isSubscribed ? (
                'Subscribed'
              ) : (
                'Subscribe'
              )}
            </button>
          </div>

          {/* Video Description */}
          <div className="Video-Stream-video-description">
            <div className={`Video-Stream-description-text ${showFullDescription ? 'expanded' : ''}`}>
              {videoDetails.description}
            </div>
            {videoDetails.description.length > 150 && (
              <button 
                className="Video-Stream-show-more-button"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Comments Section */}
          <div className="Video-Stream-comments-section">
            <h3 className="Video-Stream-comments-header">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            
            {userData && (
              <form className="Video-Stream-comment-form" onSubmit={addComment}>
                <div className="Video-Stream-comment-input-container">
                  <img 
                    src={userData.avatar || defaultUserAvatar} 
                    alt={userData.fullname} 
                    className="Video-Stream-user-avatar" 
                  />
                  <textarea
                    ref={commentInputRef}
                    value={newComment}
                    onChange={handleCommentInputChange}
                    placeholder="Add a comment..."
                    className="Video-Stream-comment-input"
                    rows={1}
                  />
                </div>
                <div className="Video-Stream-comment-buttons">
                  <button 
                    type="button" 
                    className="Video-Stream-cancel-button"
                    onClick={() => {
                      setNewComment('');
                      if (commentInputRef.current) {
                        commentInputRef.current.style.height = 'auto';
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="Video-Stream-comment-submit-button"
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </button>
                </div>
              </form>
            )}

            {isCommentsLoading ? (
              <div className="Video-Stream-comments-loading">
                <div className="Video-Stream-loader"></div>
                <p>Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              <div className="Video-Stream-comments-list">
                {comments.map(comment => (
                  <div key={comment._id} className="Video-Stream-comment">
                    <Link to={`/profile/${comment.owner.username}/${comment.owner._id}`} className="Video-Stream-comment-avatar-link">
                      <img 
                        src={comment.owner.avatar || defaultUserAvatar} 
                        alt={comment.owner.fullname} 
                        className="Video-Stream-comment-avatar" 
                      />
                    </Link>
                    
                    <div className="Video-Stream-comment-content">
                      <div className="Video-Stream-comment-header">
                        <Link to={`/profile/${comment.owner.username}/${comment.owner._id}`} className="Video-Stream-comment-author">
                          {comment.owner.fullname}
                        </Link>
                        <span className="Video-Stream-comment-date">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="Video-Stream-comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="Video-Stream-no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar for recommended videos */}
        <div className="Video-Stream-recommended-videos">
          <h3 className="Video-Stream-recommended-title">Recommended Videos</h3>
          {recommendedVideos.length > 0 ? (
            <div className="Video-Stream-recommended-list">
              {recommendedVideos.map(video => (
                <Link 
                  to={`/video/${video.owner.username}/${video._id}`} 
                  key={video._id} 
                  className="Video-Stream-recommended-item"
                >
                  <div className="Video-Stream-recommended-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    <span className="Video-Stream-recommended-duration">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="Video-Stream-recommended-info">
                    <h4 className="Video-Stream-recommended-video-title">{video.title}</h4>
                    <p className="Video-Stream-recommended-channel">{video.owner.fullname}</p>
                    <div className="Video-Stream-recommended-meta">
                      <span>{formatViews(video.views)} views</span>
                      <span>•</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="Video-Stream-no-recommendations">
              <p>No recommended videos available</p>
            </div>
          )}
        </div>
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="Video-Stream-playlist-modal-backdrop" onClick={() => setShowPlaylistModal(false)}>
          <div className="Video-Stream-playlist-modal" onClick={e => e.stopPropagation()}>
            <div className="Video-Stream-playlist-modal-header">
              <h3>Save to...</h3>
              <button 
                className="Video-Stream-close-modal-button"
                onClick={() => setShowPlaylistModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="Video-Stream-playlist-list">
              {playlists.length > 0 ? (
                playlists.map(playlist => (
                  <div key={playlist._id} className="Video-Stream-playlist-item">
                    <button 
                      className="Video-Stream-playlist-select-button"
                      onClick={() => addToPlaylist(playlist._id)}
                    >
                      {playlist.name}
                    </button>
                  </div>
                ))
              ) : (
                <p className="Video-Stream-no-playlists">You don't have any playlists yet.</p>
              )}
            </div>
            
            <div className="Video-Stream-playlist-modal-footer">
              <Link to="/dashboard/playlists" className="Video-Stream-create-playlist-link">
                Create new playlist
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="Video-Stream-share-modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="Video-Stream-share-modal" onClick={e => e.stopPropagation()}>
            <div className="Video-Stream-share-modal-header">
              <h3>Share</h3>
              <button 
                className="Video-Stream-close-modal-button"
                onClick={() => setShowShareModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="Video-Stream-share-content">
              <div className="Video-Stream-share-link-container">
                <input 
                  type="text" 
                  className="Video-Stream-share-link-input" 
                  value={`${window.location.origin}/video/${videoDetails.owner.username}/${videoDetails._id}`}
                  readOnly
                />
                <button 
                  className="Video-Stream-copy-link-button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/video/${videoDetails.owner.username}/${videoDetails._id}`);
                    toaster.push(
                      <Message type="success" closable>
                        Link copied to clipboard!
                      </Message>
                    );
                  }}
                >
                  Copy
                </button>
              </div>
              
              <div className="Video-Stream-share-options">
                <button className="Video-Stream-share-option">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span>Facebook</span>
                </button>
                <button className="Video-Stream-share-option">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1DA1F2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                  <span>Twitter</span>
                </button>
                <button className="Video-Stream-share-option">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"></path>
                    <path d="M20.52 3.449C12.831-3.984.106 1.407.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.715 1.447h.006c10.345 0 15.731-10.003 7.464-20.346zm-7.45 18.521h-.005c-2.801-.001-5.547-.794-7.907-2.295l-.566-.339-5.893 1.54 1.56-5.705-.37-.588c-1.632-2.435-2.484-5.316-2.48-8.352C2.409 4.988 8.907.709 17.089 5.122c6.14 3.291 6.331 12.42 1.415 15.949 2.451-1.158 4.51-4.018 4.382-7.523-.201-5.617-6.123-9.82-11.665-7.04-.48.24-1.589 1.342-2.296 2.628-.854 1.556-.765 4.366 1.425 7.25 2.278 2.994 5.303 5.187 8.097 5.895 3.734.943 8.14.642 9.401-2.31 1.4-3.272-2.161-5.835-3.925-6.946.288-.096.574-.188.84-.293 1.547-.604 9.345-3.324 5.23-9.972C21.815-.619 7.474-1.047 3.89 9.376c-1.174 3.421-.328 7.11 2.246 10.237z" fill-rule="nonzero"></path>
                  </svg>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoStream;