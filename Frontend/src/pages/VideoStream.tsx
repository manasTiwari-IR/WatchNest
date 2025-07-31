import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToaster, Message } from 'rsuite';
import useCustomHooks from '../functions/CustomHook';
import Navbar from '../components/Navbar.tsx';
import '../cssfiles/VideoStreamPage.css';
import defaultUserAvatar from '../assets/user-avatar.png';

interface VideoDetails {
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  duration: number;
  views: number;
  createdAt: string;
  keys: string[];
  owner: [
    {
      _id: string;
      username: string;
      fullname: string;
      avatar: string[];
    }
  ];
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  isLiked: boolean;  // if comment is liked by req.user
  owner: [{
    _id: string;
    username: string;
    fullname: string;
    avatar: string[];
  }];
}

interface UserDataProps {
  _id: string;
  username: string;
  fullname: string;
  avatar: string[];
}


const VideoStream: React.FC = () => {
  // Get video ID from URL params
  const { videoId } = useParams<{ videoId: string }>();
  const toaster = useToaster();
  const data = useSelector((state: any) => state.userData.data);
  const key = useSelector((state: any) => state.userData.key);
  const { verifyRefreshToken, decryptData, formatYouTubeDate } = useCustomHooks();
  const verifyRefreshTokenResponse: boolean = useSelector((state: any) => state.verifyRefreshToken.val);
  // console.log("verifyRefreshTokenResponse: ", verifyRefreshTokenResponse);

  useEffect(() => {
    //  console.log("useEffect called in Dashboard");
    if (!verifyRefreshTokenResponse) {
      console.log("Calling VerifyRefreshToken function");
      verifyRefreshToken("/login");
    }
  }, []);

  // State for various data
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isYourChannel, setIsYourChannel] = useState<boolean>(false);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);

  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [imagetype, setImageType] = useState<string>('jpg');

  const [playlists, setPlaylists] = useState<any[]>([]);

  const [subscribeButtonLoading, setSubscribeButtonLoading] = useState<boolean>(false);

  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([]);

  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // User data from redux store
  const [userData, setUserData] = useState<UserDataProps | null>(null);

  // console.log("User data from redux store:", data, key);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const apiUrl = import.meta.env.VITE_api_URL;

  // Fetch user data from redux store
  useEffect(() => {
    if (data && key) {
      decryptData(data, key)
        .then((res: UserDataProps) => {
          setUserData(res);
          // console.log("User data decrypted:", res);
        })
        .catch((error: any) => {
          console.error("Error decrypting user data: ", error);
          throw new Error("Failed to decrypt user data");
        });
    }
  }, [data, key]);

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
          // console.log("Video details fetched:", data);
          setVideoDetails(data.data);
          checkLikeStatus(data.data._id);
          checkSubscriptionStatus(data.data.owner[0]._id, data.data.owner[0].username);
          setImageType(data.data.thumbnail.split('.').pop() || 'jpg');
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching video details:', error);
          toaster.push(
            <Message type="error" closable>
              Error loading video. Please try again.
            </Message>, { placement: 'topEnd' }
          );
          setIsLoading(false);
          throw error;
        });
    }
  }, [videoId, apiUrl]);

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
          // console.log("Comments fetched:", data);
          setComments(data.data);
          setIsCommentsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
          setIsCommentsLoading(false);
          throw error;
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
          // console.log("Playlists fetched:", data);
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
      fetch(`${apiUrl}/api/v1/videos?page=1&limit=6&sortBy=createdAt&sortType=desc`, {
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
          // console.log("Recommended videos fetched:", data);
          setRecommendedVideos(data.data[0].videos);
        })
        .catch(error => {
          console.error('Error fetching recommended videos:', error);
        });
    }
  }, [videoDetails, apiUrl]);

  // Add video to Hostory when VideoDetails are loaded
  useEffect(() => {
    if (videoDetails) {
      addToWatchHistory();
    }
  }, [videoDetails]);

  // Check if user has liked the video
  const checkLikeStatus = (videoId: string) => {
    fetch(`${apiUrl}/api/v1/videos/check/isLiked/${videoId}`, {
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
        // console.log("Like status checked:", data);
        setIsLiked(data.data.isLiked);
        setLikesCount(data.data.likesCount);
      })
      .catch(error => {
        console.error('Error checking like status:', error);
      });
  };

  // Check if user is subscribed to the channel
  const checkSubscriptionStatus = (channelId: string, username: string) => {
    fetch(`${apiUrl}/api/v1/users/c/${channelId}/${username}`, {
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
        // console.log("Subscription status checked:", data);
        setIsSubscribed(data.data.isSubscribed);
        setIsYourChannel(data.data.user[0].isYourChannel);
      })
      .catch(error => {
        console.error('Error checking subscription status:', error);
      });
  };

  // Toggle like status
  const toggleLikeVideo = () => {
    if (!userData) {
      toaster.push(
        <Message type="info" closable>
          Please log in to like videos
        </Message>, { placement: 'topEnd' }
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
      .then(_ => {
        // console.log("Like status toggled:", data);
        setLikesCount((prev) => isLiked ? prev - 1 : prev + 1);
        setIsLiked((prev) => !prev);
      })
      .catch(error => {
        console.error('Error toggling like:', error);
        toaster.push(
          <Message type="error" closable>
            Error updating like status
          </Message>, { placement: 'topEnd' }
        );
        throw error;
      });
  };
  // Toggle subscription status
  const toggleSubscription = () => {
    if (!userData) {
      toaster.push(
        <Message type="info" closable>
          Please log in to subscribe to channels
        </Message>, { placement: 'topEnd' }
      );
      return;
    }

    if (!videoDetails) return;
    setSubscribeButtonLoading(true);

    fetch(`${apiUrl}/api/v1/subscriptions/c/${videoDetails.owner[0]._id}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to toggle subscription');
        }
        return response.json();
      })
      .then(_ => {
        // console.log("Subscription status toggled:", data);
        setIsSubscribed((prev) => !prev);
        setSubscribeButtonLoading(false);
      })
      .catch(error => {
        console.error('Error toggling subscription:', error);
        toaster.push(
          <Message type="error" closable>
            Error updating subscription status
          </Message>, { placement: 'topEnd' }
        );
        setSubscribeButtonLoading(false);
        throw error;
      });
  };

  //Add video to Watch History
  const addToWatchHistory = () => {
    fetch(`${apiUrl}/api/v1/users/add/video-history/${videoDetails?._id}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 400) {
          return;
        } else if (!response.ok) {
          throw new Error('Failed to add to watch history');
        }
        return response.json();
      })
      .then(_ => {
        // console.log("Video added to watch history:", _);
      })
      .catch(error => {
        console.error('Error adding to watch history:', error);
        throw error;
      });
  };

  // Add video to playlist
  const addToPlaylist = (playlistId: string) => {
    if (!videoDetails) return;

    fetch(`${apiUrl}/api/v1/playlists/add/${videoDetails._id}/${playlistId}`, {
      method: 'PATCH',
      credentials: 'include',
    })
      .then(response => {
        if (response.status === 400) {
          return "Video already exists in this playlist";
        } else if (!response.ok) {
          throw new Error('Failed to add to playlist');
        }
        return response.json();
      })
      .then(data => {
        if (data === "Video already exists in this playlist") {
          toaster.push(
            <Message type="info" closable>
              Video already exists in this playlist
            </Message>, { placement: 'topEnd' }
          );
          return;
        }
        else {
          // console.log("Video added to playlist:", data);
          toaster.push(
            <Message type="success" closable>
              Video added to playlist
            </Message>, { placement: 'topEnd' }
          );
          setShowPlaylistModal(false);
        }
      })
      .catch(error => {
        console.error('Error adding to playlist:', error);
        toaster.push(
          <Message type="error" closable>
            Error adding video to playlist
          </Message>, { placement: 'topEnd' }
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
        // console.log("Comment added:", data);
        const newCommentData: Comment = {
          _id: data.data.comment._id,
          content: newComment,
          createdAt: new Date().toISOString(),
          isLiked: false,
          owner: [{
            _id: userData._id,
            username: userData.username,
            fullname: userData.fullname,
            avatar: userData.avatar ? userData.avatar : [defaultUserAvatar],
          },]
        }
        // console.log("New comment data:", newCommentData);
        setComments(prev => [newCommentData, ...prev]);
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
          </Message>, { placement: 'topEnd' }
        );
        throw error;
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
      <Navbar opendrawer={true} />

      <div className="Video-Stream-video-content-container">
        <div className="Video-Stream-video-player-section">
          {/* Video Player */}
          <div className="Video-Stream-video-player">
            <video
              ref={videoRef}
              src={videoDetails.videoFile || 'null'}
              poster={`https://res.cloudinary.com/${import.meta.env.VITE_cloudinary_client_id}/image/upload/q_70/${videoDetails.keys[1]}.${imagetype}` || 'null'}
              controls
              controlsList='nodownload'
              autoPlay={false}
              preload="metadata"
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
          </div>

          {/* Video Info */}
          <div className="Video-Stream-video-info">
            <h1 className="Video-Stream-video-title">{videoDetails.title}</h1>

            <div className="Video-Stream-video-stats">
              <div className="Video-Stream-views-date">
                <span className="Video-Stream-views">{formatViews(videoDetails.views)} views</span>
                <span className="Video-Stream-date">{formatYouTubeDate(videoDetails.createdAt)}</span>
              </div>

              <div className="Video-Stream-video-actions">
                {/* Like Count  */}
                <button
                  className={`Video-Stream-action-button Video-Stream-like-button ${isLiked ? 'active' : ''}`}
                  onClick={toggleLikeVideo}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                  </svg>
                  <span>{likesCount}</span>
                </button>

                {/* Save btn  */}
                <button
                  className="Video-Stream-action-button Video-Stream-playlist-button"
                  onClick={() => setShowPlaylistModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M9.5 6.5a.5.5 0 0 0-1 0v2h-2a.5.5 0 0 0 0 1h2v2a.5.5 0 0 0 1 0v-2h2a.5.5 0 0 0 0-1h-2zM4.5 2A2.5 2.5 0 0 0 2 4.5v9A2.5 2.5 0 0 0 4.5 16h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 13.5 2zM3 4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 3 13.5zM7.5 18a3.5 3.5 0 0 1-2.45-1h9.45a2.5 2.5 0 0 0 2.5-2.5V5.05c.619.632 1 1.496 1 2.45v7a3.5 3.5 0 0 1-3.5 3.5z" /></svg>
                  <span>Save</span>
                </button>

                {/* Share btn  */}
                <button
                  className="Video-Stream-action-button Video-Stream-share-button"
                  onClick={() => setShowShareModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 12a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m5-5.5l-5 3.5m5 7.5l-5-3.5m10 4.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m0-13a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0" /></svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="Video-Stream-channel-info">
            <div className="Video-Stream-channel-details">
              <Link to={`/dashboard/profile/${videoDetails.owner[0].username}/${videoDetails.owner[0]._id}`} className="Video-Stream-channel-avatar-link">
                <img
                  src={videoDetails.owner[0].avatar[0] || defaultUserAvatar}
                  alt={videoDetails.owner[0].fullname}
                  className="Video-Stream-channel-avatar"
                />
              </Link>

              <div className="Video-Stream-channel-text">
                <Link to={`/dashboard/profile/${videoDetails.owner[0].username}/${videoDetails.owner[0]._id}`} className="Video-Stream-channel-name">
                  {videoDetails.owner[0].fullname}
                </Link>
                <span className="Video-Stream-channel-username">@{videoDetails.owner[0].username}</span>
              </div>
            </div>

            <button
              hidden={isYourChannel}
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
                    src={userData.avatar?.[0] || defaultUserAvatar}
                    alt="User Avatar"
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
                    <Link to={`/dashboard/profile/${comment.owner[0].username}/${comment.owner[0]._id}`} className="Video-Stream-comment-avatar-link">
                      <img
                        src={comment.owner[0].avatar[0] || defaultUserAvatar}
                        alt={comment.owner[0].fullname}
                        className="Video-Stream-comment-avatar"
                      />
                    </Link>

                    <div className="Video-Stream-comment-content">
                      <div className="Video-Stream-comment-header">
                        <Link to={`/dashboard/profile/${comment.owner[0].username}/${comment.owner[0]._id}`} className="Video-Stream-comment-author">
                          {comment.owner[0].fullname}
                        </Link>
                        <span className="Video-Stream-comment-date">
                          {formatYouTubeDate(comment.createdAt)}
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
              {recommendedVideos.map(video => {
                if (video._id === videoDetails._id) return null; // Skip the current video
                else {
                  const recommendedimagetype = video.thumbnail.split('.').pop() || 'jpg';
                  return (
                    <Link
                      to={`/video/${video.channel._id}/${video._id}`}
                      key={video._id}
                      className="Video-Stream-recommended-item"
                    >
                      <div className="Video-Stream-recommended-thumbnail">
                        <img src={`https://res.cloudinary.com/${import.meta.env.VITE_cloudinary_client_id}/image/upload/q_40/${video.keys[1]}.${recommendedimagetype}`} alt={video.title} />
                        <span className="Video-Stream-recommended-duration">
                          {Math.floor(video?.duration ? video?.duration / 60 : 0)}:{Math.floor(video?.duration ? video?.duration % 60 : 0).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="Video-Stream-recommended-info">
                        <h4 className="Video-Stream-recommended-video-title">{video.title}</h4>
                        <p className="Video-Stream-recommended-channel">{video.channel.fullname}</p>
                        <div className="Video-Stream-recommended-meta">
                          <span>{formatViews(video.views)} views</span>
                          <span>•</span>
                          <span>{formatYouTubeDate(video.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
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
                  value={`${window.location.origin}/video/${videoDetails.owner[0].username}/${videoDetails._id}`}
                  readOnly
                />
                <button
                  className="Video-Stream-copy-link-button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/video/${videoDetails.owner[0].username}/${videoDetails._id}`);
                    toaster.push(
                      <Message type="success" closable>
                        Link copied to clipboard!
                      </Message>, { placement: 'topEnd' }
                    );
                  }}
                >
                  Copy
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