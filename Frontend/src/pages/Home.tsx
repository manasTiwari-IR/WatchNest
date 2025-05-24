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

const Home: React.FC = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(185, 214, 249) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#222",
                fontFamily: "Segoe UI, sans-serif",
                padding: "0 1rem",
                backdropFilter: "blur(0.5px)",
            }}
        >
            <div style={{ display: "flex", width: "90%", padding: "1rem", marginTop: ".5rem", alignItems: "center", gap: "1.1rem", }}>
                <img
                    src="../src/assets/android-chrome-512x512.png"
                    className="home-logo"
                    alt="VidTube Logo"
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "20%",
                        boxShadow: "0 4px 16px rgba(30,60,114,0.10)",
                        background: "#fff",
                        objectFit: "cover",
                    }}
                />
                <h1 style={{ ...responsiveFont, color: "#222", margin: 0 }}>VidTube</h1>
            </div>
            {/* Top Section: Logo, Title, Description, Button, Image */}
            <div
                className="max-[850px]:mt-[1.3rem]"
                style={{
                    display: "flex",
                    width: "80%",
                    maxWidth: "1100px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.3rem",
                    marginBottom: "3rem",
                    flexWrap: "wrap",
                }}
            >
                {/* Left: Logo, Title, Description, Button */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        minWidth: 0,
                        flex: "1 1 320px",
                        maxWidth: "500px",
                        gap: "0.7rem",
                    }}
                >
                    {/* Description */}
                    <p style={{
                        fontSize: "clamp(1.3rem, 3vw, 2.4rem)",
                        color: "rgb(71 71 71)",
                        margin: "0.5rem 0px 0.7rem",
                        fontWeight: 400
                    }}>
                        Upload, Stream, and Share Your Favorite Videos Instantly!
                    </p>
                    {/* Get Started Button */}
                    <Link
                        to="/login"
                        style={{
                            background: "#fff",
                            color: "#2a5298",
                            padding: "0.7rem 1.5rem",
                            borderRadius: "1.5rem",
                            fontWeight: 500,
                            fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                            textDecoration: "none",
                            boxShadow: "0 2px 12px rgba(30,60,114,0.08)",
                            transition: "background 0.2s, color 0.2s, transform 0.18s",
                            display: "inline-flex",
                            gap: "0.4rem",
                            letterSpacing: "0.02em",
                            cursor: "pointer",
                            outline: "none",
                            border: "1px solid #e0e0e0",
                            alignItems: "flex-end",
                            marginTop: "0.5rem",
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = "#f0f4ff";
                            e.currentTarget.style.color = "#1e3c72";
                            e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.color = "#2a5298";
                            e.currentTarget.style.transform = "none";
                        }}
                    >
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
                            <circle cx="12" cy="12" r="11" fill="#2a5298" opacity="0.10" />
                            <path
                                d="M10 8l4 4-4 4"
                                stroke="#2a5298"
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
                            `}
                        </style>
                    </Link>
                </div>
                {/* Right: Illustration/Image */}
                <div
                    style={{
                        flex: "1 1 320px",
                        minWidth: "260px",
                        maxWidth: "420px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "0.5rem",
                    }}
                >
                    <img
                        src="../src/assets/home-page.png"
                        alt="Video Streaming Illustration"
                        style={{
                            width: "100%",
                            maxWidth: "370px",
                            borderRadius: "1.2rem",
                            objectFit: "cover",
                        }}
                    />
                </div>
            </div>

            {/* Features Section */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    width: "100%",
                    maxWidth: "85%",
                    marginBottom: "2.5rem",
                }}
            >
                <Feature
                    icon={
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" fill="#2a5298" opacity="1" />
                            <polygon points="10,9 16,12 10,15" fill="#fff" />
                        </svg>
                    }
                    title="Stream Instantly"
                    desc="Watch videos in HD with no buffering."
                />
                <Feature
                    icon={
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                            <path d="M12 3v18M5 12h14" stroke="#2a5298" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                    title="Upload Easily"
                    desc="Share your moments with a simple upload."
                />
                <Feature
                    icon={
                        <svg width="40" height="40" fill="#2a5298" viewBox="0 0 24 24">
                            <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" fill="#2a5298" opacity="1" />
                        </svg>
                    }
                    title="Share Anywhere"
                    desc="Send videos to friends and family."
                />
                <style>
                    {`
                @media (max-width: 850px) {
                   
                }
                }
            `}
                </style>
            </div>
        </div >
    );
};

const Feature: React.FC<{
    icon: React.ReactNode;
    title: string;
    desc: string;
}> = ({
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
                background: "rgba(255,255,255,1)",
                borderRadius: "1rem",
                padding: "1.2rem 1.5rem",
                minWidth: 0,
                textAlign: "center",
                boxShadow: "0 3px 10px rgba(30,60,114,0.35)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                transition: "all 0.2s",
            }}
        >
            <div style={{ marginBottom: "0.5rem" }}>{icon}</div>
            <div
                style={{
                    fontWeight: 600,
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    marginBottom: "0.3rem",
                }}
            >
                {title}
            </div>
            <div style={{ fontSize: "clamp(0.88rem, 2vw, 1rem)", color: "black", marginBottom: ".3rem" }}>{desc}</div>
        </div>
    );

export default Home;
