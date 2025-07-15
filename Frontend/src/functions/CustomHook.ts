import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { setUserData } from "../ReduxStateManagement/varSlice.ts";
import { setVerifyRefreshToken } from "../ReduxStateManagement/responseSlice.ts";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, isWithinInterval, sub, subDays, subWeeks, differenceInWeeks } from "date-fns";

// Custom hook for verifying refresh token
const useCustomHooks = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const storeReduxData = async (userData: string, key: string) => {
        // Encrypt user data if needed
        const encryptedData = CryptoJS.AES.encrypt(userData, key).toString();
        dispatch(setUserData({ data: encryptedData, key }));
    };

    const decryptData = async (encryptedData: string, key: string) => {
        // Decrypt the data
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        // Parse the decrypted data as JSON
        const parsedData = JSON.parse(decryptedData);
        return parsedData;
    };

    const verifyRefreshToken = async (redirect: string) => {
        console.log("Verifying refresh token...");
        try {
            const response = await fetch("http://localhost:8001/api/v1/users/verify-refresh-token", {
                method: "GET",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const responseData = await response.json();
                storeReduxData(JSON.stringify(responseData.data.user), responseData.data.key);
                console.log("Data stored in Redux successfully (refresh token)");
                dispatch(setVerifyRefreshToken({ val: true }));
            } else {
                console.error("Failed to verify refresh token:", response.statusText);
                dispatch(setVerifyRefreshToken({ val: false }));
                navigate(redirect, { replace: true });
            }
        } catch (error) {
            console.error("Error verifying refresh token:", error);
            dispatch(setVerifyRefreshToken({ val: false }));
            navigate(redirect, { replace: true });
        }
    };


    // Function to convert ISO date string to YouTube-style format
    const formatYouTubeDate = (isoDate: string): string => {
        try {
            // Parse the ISO date string to a Date object
            const date = new Date(isoDate);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }
            // Current date (based on provided context: July 15, 2025, 11:43 PM IST)
            const now = new Date("2025-07-15T11:43:00+05:30");
            // Check if the date is within the last 7 days for relative formatting
            const isRecent = isWithinInterval(date, {
                start: subDays(now, 7),
                end: sub(now, { days: -1 })
            });
            const isWeekRecent = isWithinInterval(date, {
                start: subWeeks(now, 5),
                end: now
            });
            const isMonthRecent = isWithinInterval(date, {
                start: sub(now, { months: 13 }),
                end: now
            });
            const isYearRecent = isWithinInterval(date, {
                start: sub(now, { years: 15 }),
                end: now
            });

            if (isRecent) {
                // Return relative time (e.g., "2 days ago")
                return formatDistanceToNow(date, { addSuffix: true });
            }
            else if (isWeekRecent) {
                // Return relative time in weeks (e.g., "2 weeks ago")
                const weeksDiff = differenceInWeeks(now, date);
                return `${weeksDiff} week${weeksDiff === 1 ? '' : 's'} ago`;
            }
            else if (isMonthRecent) {
                // Return relative time in months (e.g., "2 months ago")
                const monthsDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
                if (monthsDiff === 0) return `1 month ago`;
                return `${monthsDiff} month${monthsDiff === 1 ? '' : 's'} ago`;
            }
            else if (isYearRecent) {
                // Return relative time in years (e.g., "2 years ago")
                const yearsDiff = now.getFullYear() - date.getFullYear();
                return `${yearsDiff} year${yearsDiff === 1 ? '' : 's'} ago`;
            }
            else {
                // Return full date (e.g., "Jul 13, 2025")
                return format(date, "MMM d, yyyy");
            }
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    }

    // Return the functions to make them accessible
    return { storeReduxData, decryptData, verifyRefreshToken, formatYouTubeDate };
};

export default useCustomHooks;