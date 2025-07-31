import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
// import CryptoJS from "crypto-js";
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
                <Navbar opendrawer={false} />

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
