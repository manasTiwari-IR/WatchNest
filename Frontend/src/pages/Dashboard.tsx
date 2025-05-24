import "../cssfiles/DashboardStyles.css"
import { Link, Outlet, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useToaster, Message } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import React, { useEffect } from "react";
// import Footer from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../ReduxStateManagement/varSlice.ts";

const Dashboard: React.FC = () => {
    const dispatch = useDispatch();
    const toaster = useToaster();
    const navigate = useNavigate();
    // get value of refreshTokenVerified from sessionStorage
    const verifyRefreshTokenResponse: string | null = sessionStorage.getItem("refreshTokenVerified");
    console.log("verifyRefreshTokenResponse: ", verifyRefreshTokenResponse);
    const verifyRefreshToken = async () => {
        if (!verifyRefreshTokenResponse) {
            // If refreshTokenVerified is not set, redirect to login page 
            navigate("/login");
        }
    };

    useEffect(() => {
        verifyRefreshToken();
    }, []);

    return (
        <>
            <div className="dashboard-container">
                {/* Navbar */}
                <Navbar />

                {/* Main Content */}
                < main className="main-content" >
                    <Sidebar />
                    <Outlet />
                </main >
            </div >
        </>
    );
}

export default Dashboard;
