import React, { useEffect } from "react";
import "../cssfiles/SignUpPageStyles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useToaster, Message } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { setUserData } from "../ReduxStateManagement/varSlice.ts";
import { setVerifyRefreshToken } from "../ReduxStateManagement/responseSlice.ts";

type SignUpFormInputs = {
    fullname: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
};

const schema = yup.object().shape({
    fullname: yup.string().required("Name is required").min(2, "Name too short"),
    email: yup.string().email("Invalid email").required("Email is required"),
    username: yup
        .string()
        .required("Username is required")
        .min(5, "Username too short")
        .matches(/^[a-z0-9_]+$/, "Username must be in lowercase"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(24, "Password must be at most 24 characters"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
});

const labelStyles: React.CSSProperties = {
    fontWeight: 600,
    color: "#6366f1",
    letterSpacing: "0.02em"
};
const errorStyles: React.CSSProperties = {
    color: "#dc2626",
    fontSize: "clamp(.73rem, 1vw, .9rem)",
    marginTop: "0.5rem",
};

interface SignupProps {
    redirectTo?: string;
}

const SignUpPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SignUpFormInputs>({
        resolver: yupResolver(schema),
    });

    const [showPassword1, setShowPassword1] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);
    const toaster = useToaster();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    // const verifyRefreshTokenResponse = useSelector((state: any) => state.verifyRefreshToken.val);
    const { redirectTo } = (location.state as SignupProps) || {};
    const [isVerifying, setIsVerifying] = React.useState(true);
    const apiURL = import.meta.env.VITE_api_URL;
    const verifyRefreshToken = async () => {
        try {
            const response = await fetch(`${apiURL}/api/v1/users/verify-refresh-token`, {
                method: "GET",
                credentials: "include", // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const responseData = await response.json();
                await storeReduxData(JSON.stringify(responseData.data.user), responseData.data.key);
                console.log("Data stored in Redux successfully (refresh token)");
                toaster.push(
                    (<Message type="success" showIcon
                        style={{
                            backgroundColor: "#fffbe6", // warm yellow
                            color: "black",
                            borderRadius: "22px",
                            fontSize: ".9rem",
                        }}>
                        Welcome back!
                    </Message>),
                    { placement: 'topEnd', duration: 1500 }
                );
                dispatch(setVerifyRefreshToken({ val: true }));
                navigate(redirectTo || "/dashboard", { replace: true });
            }
        } catch (error) {

        }
        finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        verifyRefreshToken();
    }, []);

    const storeReduxData = async (data: string, key: string) => {
        // Encrypt the data
        const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
        // Store the encrypted data in Redux store  
        dispatch(setUserData({ data: encryptedData, key: key }));
    };

    const onSubmit = async (data: SignUpFormInputs) => {
        try {
            const response = await fetch(`${apiURL}/api/v1/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include" // Include cookies in the request
            });

            console.log("Response : ", response);
            if (!response.ok) {
                console.error("SignUp failed:", response.statusText);
                toaster.push(
                    (<Message showIcon closable type="error" header="SignUp Failed"
                        style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                        {response.status === 409 ? "User with email or username already exists" :
                            "Something went wrong. Please try again."
                        }
                    </Message>),
                    { placement: 'topEnd', duration: 3000 }
                );
            }
            else {
                const responseData = await response.json();
                try {
                    // console.log("Response data : ",responseData);
                    await storeReduxData(JSON.stringify(responseData.data.createdUser), responseData.data.key);
                    console.log("Data stored in Redux successfully");
                    dispatch(setVerifyRefreshToken({ val: true }));
                    toaster.push(
                        (<Message showIcon closable type="success" header="Login Successful"
                            style={{ backgroundColor: "#d1e7dd", color: "#0f5132", borderColor: "#b6e0f3" }}>
                            Welcome back! You have successfully logged in.
                        </Message>),
                        { placement: 'topEnd', duration: 1000 }
                    );
                    try {
                        navigate(redirectTo || "/dashboard", { replace: true });
                    } catch (e) {
                        console.error("Navigation error:", e);
                        navigate("/error-page", {
                            state: {
                                statusCode: 500,
                                message: "Something went wrong.",
                                imageUrl: "../src/assets/something-went-wrong.png"

                            }
                        });
                    }
                } catch (error) {
                    console.error("Error in Redux:", error);
                    toaster.push(
                        (<Message showIcon closable type="error" header="Error Occurred"
                            style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                            An error occurred while storing data. Please try again.
                        </Message>),
                        { placement: 'topEnd', duration: 1500 }
                    );
                    return;
                }
                reset();
            }
        } catch (error: any) {
            console.error("Error during SignUp:", error);
            toaster.push(
                (<Message showIcon closable type="error" header="Internal Server Error"
                    style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                    {error.message || "An unexpected error occurred. Please try again later."}
                </Message>),
                { placement: 'topEnd', duration: 1500 }
            );
        }
    }

    return (
        <>
            <section className="outer-signup" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1699%26quot%3b)' fill='none'%3e%3ccircle r='46.666666666666664' cx='1263.02' cy='190.48' fill='%23d3b714'%3e%3c/circle%3e%3crect width='212.84' height='212.84' clip-path='url(%26quot%3b%23SvgjsClipPath1700%26quot%3b)' x='891.13' y='192.79' fill='url(%26quot%3b%23SvgjsPattern1701%26quot%3b)' transform='rotate(28.26%2c 997.55%2c 299.21)'%3e%3c/rect%3e%3ccircle r='73.84728827705486' cx='751.56' cy='490.46' stroke='%23e73635' stroke-width='1' stroke-dasharray='3%2c 2'%3e%3c/circle%3e%3crect width='336' height='336' clip-path='url(%26quot%3b%23SvgjsClipPath1702%26quot%3b)' x='-9.99' y='17.33' fill='url(%26quot%3b%23SvgjsPattern1703%26quot%3b)' transform='rotate(330.37%2c 158.01%2c 185.33)'%3e%3c/rect%3e%3cpath d='M79.88 185.89a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM67.85 175.34a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM55.82 164.79a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM43.79 154.24a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM114.49 194.96a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM102.46 184.41a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM90.43 173.86a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM78.4 163.31a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM149.1 204.02a5.6 5.6 0 1 0-8.42-7.38 5.6 5.6 0 1 0 8.42 7.38zM137.07 193.48a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM125.04 182.93a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39zM113.01 172.38a5.6 5.6 0 1 0-8.42-7.39 5.6 5.6 0 1 0 8.42 7.39z' stroke='%23d3b714' stroke-width='2.7' stroke-dasharray='4%2c 4'%3e%3c/path%3e%3crect width='109.48' height='109.48' clip-path='url(%26quot%3b%23SvgjsClipPath1704%26quot%3b)' x='1360.43' y='419.49' fill='url(%26quot%3b%23SvgjsPattern1705%26quot%3b)' transform='rotate(238.71%2c 1415.17%2c 474.23)'%3e%3c/rect%3e%3cpath d='M835.75 190.59 L774.61 179.65L764.1171296992804 226.18287030071969z' stroke='%23d3b714' stroke-width='1' stroke-dasharray='2%2c 2'%3e%3c/path%3e%3cpath d='M108.29 381.47L96.74 387.02 88.8 376.98 77.25 382.53 69.31 372.49 57.77 378.04 49.82 368M110.08 373.68L98.54 379.23 90.59 369.19 79.05 374.73 71.1 364.69 59.56 370.24 51.62 360.2' stroke='%23037b0b' stroke-width='1.3' stroke-dasharray='4%2c 4'%3e%3c/path%3e%3cpath d='M727.71 365.58a5.6 5.6 0 1 0-11.19-0.42 5.6 5.6 0 1 0 11.19 0.42zM711.72 364.99a5.6 5.6 0 1 0-11.19-0.42 5.6 5.6 0 1 0 11.19 0.42zM695.73 364.4a5.6 5.6 0 1 0-11.19-0.42 5.6 5.6 0 1 0 11.19 0.42zM679.74 363.8a5.6 5.6 0 1 0-11.19-0.41 5.6 5.6 0 1 0 11.19 0.41zM760.28 350.77a5.6 5.6 0 1 0-11.19-0.41 5.6 5.6 0 1 0 11.19 0.41zM744.29 350.18a5.6 5.6 0 1 0-11.19-0.41 5.6 5.6 0 1 0 11.19 0.41zM728.3 349.59a5.6 5.6 0 1 0-11.19-0.41 5.6 5.6 0 1 0 11.19 0.41zM712.31 349a5.6 5.6 0 1 0-11.19-0.42 5.6 5.6 0 1 0 11.19 0.42z' stroke='%23d3b714' stroke-width='1' stroke-dasharray='2%2c 2'%3e%3c/path%3e%3cpath d='M512.7 519.98L519.35 509.04 531.49 513.12 538.14 502.18 550.27 506.27 556.92 495.32 569.06 499.41M515.44 527.49L522.09 516.55 534.23 520.64 540.88 509.69 553.02 513.78 559.67 502.84 571.8 506.92M518.18 535.01L524.83 524.07 536.97 528.15 543.62 517.21 555.76 521.3 562.41 510.35 574.55 514.44' stroke='%23e73635' stroke-width='2.9' stroke-dasharray='4%2c 4'%3e%3c/path%3e%3ccircle r='92.17980809380227' cx='636.16' cy='44.34' fill='%23037b0b'%3e%3c/circle%3e%3cpath d='M102.88 325.55a5.6 5.6 0 1 0-2.58-10.89 5.6 5.6 0 1 0 2.58 10.89zM99.19 309.99a5.6 5.6 0 1 0-2.59-10.9 5.6 5.6 0 1 0 2.59 10.9zM95.49 294.42a5.6 5.6 0 1 0-2.59-10.9 5.6 5.6 0 1 0 2.59 10.9zM91.79 278.85a5.6 5.6 0 1 0-2.59-10.89 5.6 5.6 0 1 0 2.59 10.89z' fill='%23e73635'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1699'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cpattern x='0' y='0' width='6.26' height='6.26' patternUnits='userSpaceOnUse' id='SvgjsPattern1701'%3e%3cpath d='M0 6.26L3.13 0L6.26 6.26' stroke='%23d3b714' fill='none'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1700'%3e%3ccircle r='53.21' cx='997.55' cy='299.21'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='6' height='6' patternUnits='userSpaceOnUse' id='SvgjsPattern1703'%3e%3cpath d='M3 1L3 5M1 3L5 3' stroke='%23037b0b' fill='none' stroke-width='1.32'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1702'%3e%3ccircle r='84' cx='158.01' cy='185.33'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='109.48' height='7.82' patternUnits='userSpaceOnUse' id='SvgjsPattern1705'%3e%3crect width='109.48' height='3.91' x='0' y='0' fill='%23d3b714'%3e%3c/rect%3e%3crect width='109.48' height='3.91' x='0' y='3.91' fill='rgba(0%2c 0%2c 0%2c 0)'%3e%3c/rect%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1704'%3e%3ccircle r='27.37' cx='1415.17' cy='474.23'%3e%3c/circle%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e")`,
                backgroundColor: "ghostwhite",
            }}>
                <div
                    hidden={!isVerifying}
                    style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <div style={{
                        marginBottom: "1.2rem",
                        width: "48px",
                        height: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ animation: "spin 1s linear infinite" }}
                        >
                            <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="#6366f1"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray="31 80"
                            />
                        </svg>
                    </div>
                    <style>
                        {`
                        @keyframes spin {
                            100% { transform: rotate(360deg); }
                        }
                    `}
                    </style>
                </div>
                <div className="signup-container" hidden={isVerifying}>
                    <form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <h2 className="signup-title"
                            style={{ textAlign: "center", marginBottom: ".5rem", fontSize: "1.4rem", fontWeight: "bold" }}>Create Account</h2>
                        <div className="form-group">
                            <label htmlFor="name">Name*</label>
                            <input
                                id="name"
                                {...register("fullname")}
                                className={errors.fullname ? "input-error signup-input" : "signup-input"}
                                placeholder="Enter your name"
                            />
                            {errors.fullname && <span className="error">{errors.fullname.message}</span>}
                        </div>
                        {/* Username and Email  */}
                        <div className="form-group1">
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignContent: "flex-start",
                                gap: "0.2rem",
                                width: "50%",
                            }}
                                className="username-email">
                                <label htmlFor="username">Username*</label>
                                <input
                                    id="username"
                                    {...register("username")}
                                    className={errors.username ? "input-error signup-input" : "signup-input"}
                                    placeholder="Enter your username"
                                />
                                {errors.username && <span className="error">{errors.username.message}</span>}
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignContent: "flex-start",
                                gap: "0.2rem",
                                width: "50%",
                            }}
                                className="username-email">
                                <label htmlFor="email">Email*</label>
                                <input
                                    id="email"
                                    {...register("email")}
                                    className={errors.email ? "input-error signup-input" : "signup-input"}
                                    placeholder="Enter your email"
                                    maxLength={50}
                                />
                                {errors.email && <span className="error">{errors.email.message}</span>}
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ position: "relative" }}>
                            <label
                                className="login-page-label"
                                style={{
                                    ...labelStyles,
                                    fontSize: "1rem",
                                }}
                                htmlFor="password"
                            >
                                Password*
                            </label>
                            <div className="signup-password">
                                <input
                                    className={errors.password ? "input2-error" : "input2"}
                                    id="password"
                                    type={showPassword1 ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Enter your password"
                                    minLength={6}
                                    maxLength={24}
                                    style={{
                                        fontSize: ".98rem",
                                        width: "100%",
                                        border: "none",
                                    }}
                                />
                                <button
                                    type="button"
                                    className="eye-icon-login-password"
                                    aria-label={showPassword1 ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword1((prev) => !prev)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        paddingRight: "0.65rem",
                                        outline: "none",
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPassword1 ? (
                                        // Eye open SVG
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                    ) : (
                                        // Eye closed SVG
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p style={errorStyles}>{errors.password.message}</p>
                            )}
                        </div>
                        {/* Confirm Password */}
                        <div style={{ position: "relative" }}>
                            <label
                                className="login-page-label"
                                style={{
                                    ...labelStyles,
                                    fontSize: "1rem",
                                }}
                                htmlFor="confirmPassword"
                            >
                                Confirm Password*
                            </label>
                            <div className="signup-password">
                                <input
                                    className={errors.confirmPassword ? "input2-error" : "input2"}
                                    id="confirmPassword"
                                    type={showPassword2 ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    placeholder="Enter your password"
                                    minLength={6}
                                    maxLength={24}
                                    style={{
                                        border: "none",
                                        fontSize: ".98rem",
                                        width: "100%",
                                    }}
                                />
                                <button
                                    type="button"
                                    className="eye-icon-login-password"
                                    aria-label={showPassword2 ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword2((prev) => !prev)}
                                    style={{
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        paddingRight: "0.65rem",
                                        outline: "none",
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPassword2 ? (
                                        // Eye open SVG
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
                                    ) : (
                                        // Eye closed SVG
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p style={errorStyles}>{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            className="button1"
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                fontSize: "clamp(.88rem, 1.2vw, 1.15rem)",
                                width: "100%",
                                marginTop: "0.5rem",
                            }}
                        >
                            {isSubmitting ? "Signing Up..." : "Sign Up"}
                        </button>
                        <p style={{ textAlign: "center" }}>
                            Already have an account?
                            <Link
                                to="/login"
                                style={{
                                    color: "#6366f1",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    marginLeft: "0.5rem",
                                }}
                            >
                                Login
                            </Link>
                        </p>
                    </form >
                </div >
            </section>
        </>
    );
};

export default SignUpPage;