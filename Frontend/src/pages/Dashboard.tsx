import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToaster, Message } from "rsuite";
// import CryptoJS from "crypto-js";

import 'rsuite/dist/rsuite.min.css';
import "../cssfiles/DashboardStyles.css"
import Navbar from "../components/Navbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import useCustomHooks from "../functions/CustomHook.ts";
// import Footer from "../components/Footer.tsx";
// import { setUserData } from "../ReduxStateManagement/varSlice.ts";

const Dashboard: React.FC = () => {
    // const dispatch = useDispatch();
    //   const toaster = useToaster();
    //  const navigate = useNavigate();
    const { verifyRefreshToken } = useCustomHooks();
    const verifyRefreshTokenResponse: boolean = useSelector((state: any) => state.verifyRefreshToken.val);
    console.log("verifyRefreshTokenResponse: ", verifyRefreshTokenResponse);

    useEffect(() => {
      //  console.log("useEffect called in Dashboard");
        if (!verifyRefreshTokenResponse) {
            console.log("Calling VerifyRefreshToken function");
            verifyRefreshToken("/login");
        }
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
