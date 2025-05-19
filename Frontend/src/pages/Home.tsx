import React from "react";
import { Link } from "react-router-dom";

// Responsive styles
const responsiveFont = {
    fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
    margin: "1rem 0 0.5rem",
    fontWeight: 700,
};

const responsiveDesc = {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: "#e0e0e0",
};

const Home = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "Segoe UI, sans-serif",
                padding: "0 1rem",
            }}
        >
            {/* Logo and SVG */}
            <div
                style={{
                    marginBottom: "2rem",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <div className="home-logo-svg">
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="40" cy="40" r="40" fill="#fff" />
                        <polygon
                            points="32,25 62,40 32,55"
                            fill="#2a5298"
                            style={{ filter: "drop-shadow(0 2px 6px #1e3c72aa)" }}
                        />
                    </svg>
                </div>
                <h1 style={responsiveFont}>VidTube</h1>
                <p style={responsiveDesc}>
                    Upload, Stream, and Share Your Favorite Videos Instantly!
                </p>
                {/* Get Started Button */}
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Link
                        to="/login"
                        style={{
                            background: "#2a5298",
                            color: "#fff",
                            padding: "0.7rem 1.5rem 0.7rem 1.5rem",
                            borderRadius: "1.5rem",
                            fontWeight: 500,
                            fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                            textDecoration: "none",
                            boxShadow: "0 2px 12px rgba(30,60,114,0.10)",
                            transition: "background 0.2s, transform 0.18s",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            letterSpacing: "0.02em",
                            cursor: "pointer",
                            outline: "none",
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = "#1e3c72";
                            e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = "#2a5298";
                            e.currentTarget.style.transform = "none";
                        }}>

                        Get Started
                        <svg
                            width="22"
                            height="22"
                            fill="none"
                            viewBox="0 0 24 24"
                            style={{
                                animation: "bounce-right 1s infinite alternate",
                                display: "inline-block",
                            }}
                        >
                            <circle cx="12" cy="12" r="11" fill="#fff" opacity="0.18" />
                            <path
                                d="M10 8l4 4-4 4"
                                stroke="#fff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <style>
                            {`
                            @keyframes bounce-right {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(6px); }
                            }
                            @media (max-width: 600px) {
                                .home-logo-svg {
                                    display: none !important;
                                }
                            }
                        `}
                        </style>
                    </Link>
                </div>
            </div>

            {/* Hero Image */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "2rem",
                }}
            >
                <img
                    src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
                    alt="Video Streaming"
                    style={{
                        width: "320px",
                        maxWidth: "90vw",
                        borderRadius: "1.5rem",
                        boxShadow: "0 8px 32px rgba(30,60,114,0.25)",
                        border: "4px solid #fff",
                        objectFit: "cover",
                        aspectRatio: "16/9",
                    }}
                />
            </div>

            {/* Features */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    width: "100%",
                    maxWidth: "800px",
                    marginBottom: "2.5rem",
                }}
            >
                <Feature
                    icon={
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" fill="#fff" />
                            <polygon points="10,9 16,12 10,15" fill="#2a5298" />
                        </svg>
                    }
                    title="Stream Instantly"
                    desc="Watch videos in HD with no buffering."
                />
                <Feature
                    icon={
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                            <path d="M12 3v18M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="10" stroke="#2a5298" strokeWidth="2" fill="none" />
                        </svg>
                    }
                    title="Upload Easily"
                    desc="Share your moments with a simple upload."
                />
                <Feature
                    icon={
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                            <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" fill="#fff" stroke="#2a5298" strokeWidth="2" />
                        </svg>
                    }
                    title="Share Anywhere"
                    desc="Send videos to friends and family."
                />
            </div>
        </div>
    );
};

const Feature = ({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) => (
    <div
        style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "1rem",
            padding: "1.2rem 1.5rem",
            minWidth: 0,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(30,60,114,0.10)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
        }}
    >
        <div style={{ marginBottom: "0.5rem" }}>{icon}</div>
        <div
            style={{
                fontWeight: 600,
                fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                marginBottom: "0.3rem",
            }}
        >
            {title}
        </div>
        <div style={{ fontSize: "clamp(0.9rem, 2vw, 0.95rem)", color: "#e0e0e0" }}>{desc}</div>
    </div>
);

export default Home;
