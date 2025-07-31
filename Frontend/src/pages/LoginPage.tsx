import React, { useEffect } from "react";
import "../cssfiles/LoginPageStyles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";
// import Toaster from "../components/Toaster";
import { useToaster, Message } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";
import { setUserData } from "../ReduxStateManagement/varSlice.ts";
import { setVerifyRefreshToken } from "../ReduxStateManagement/responseSlice.ts";

// Validation schema
const schema = yup.object().shape({
    email: yup.string()
        .email("Invalid email")
        .required("Email is required")
        .max(100, "Email must be less than 100 characters"),
    password: yup.string()
        .min(6, "Min 6 characters")
        .required("Password is required")
        .max(24, "Max 24 characters"),
});

type LoginFormInputs = {
    email: string;
    password: string;
};

// Styles
const formStyles: React.CSSProperties = {
    background: "#f4faff",
    padding: "2.5rem",
    borderRadius: "18px",
    boxShadow: "0 6px 32px rgba(60, 72, 88, 0.18)",
    minWidth: "340px",
    border: "1px solid #e0e7ff"
};


const labelStyles: React.CSSProperties = {
    fontWeight: 600,
    color: "#6366f1",
    letterSpacing: "0.02em"
};


const errorStyles: React.CSSProperties = {
    color: "#ef4444",
    fontSize: "0.92rem",
    marginTop: "0.18rem"
};

interface LoginPageProps {
    redirectTo?: string;
}
const LoginPage: React.FC = () => {
    // add props to the page for link sharing etc.
    const location = useLocation();
    const dispatch = useDispatch();
    // const verifyRefreshTokenResponse = useSelector((state: any) => state.verifyRefreshToken.val);
    // console.log("Response Data:", verifyRefreshTokenResponse);
    const { redirectTo } = location.state as LoginPageProps || {};
    const toaster = useToaster();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });
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
                            backgroundColor: "#fffbe6",
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
            console.error("Error verifying refresh token:", error);
        }
        finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        verifyRefreshToken();
        // no need of cleanup function here
        // because we are not using any subscriptions or intervals
    }, []);

    const storeReduxData = async (data: string, key: string) => {
        // Encrypt the data
        const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
        // Store the encrypted data in Redux store  
        dispatch(setUserData({ data: encryptedData, key: key }));
    };

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await fetch(`${apiURL}/api/v1/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include" // Include cookies in the request
            });

            if (!response.ok) {
                console.error("Login failed:", response);
                toaster.push(
                    (<Message showIcon closable type="error" header="Login Failed"
                        style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                        Invalid email or password. Please try again.
                    </Message>),
                    { placement: 'topEnd', duration: 3000 }
                );
            }
            else {
                const responseData = await response.json();
                try {
                    await storeReduxData(JSON.stringify(responseData.data.loggedInUser), responseData.data.key);
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
                        { placement: 'topEnd', duration: 3000 }
                    );
                    return;
                }
                reset();
            }
        } catch (error) {
            console.error("Error during login:", error);
            toaster.push(
                (<Message showIcon closable type="error" header="Internal Server Error"
                    style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                    An error occurred while logging in. Please try again.
                </Message>),
                { placement: 'topEnd', duration: 2500 }
            );
        }
    }

    return (
        <>
            <section className="outer-login" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1109%26quot%3b)' fill='none'%3e%3cpath d='M254.64 4.3a5.6 5.6 0 1 0 8.63 7.14 5.6 5.6 0 1 0-8.63-7.14zM266.96 14.51a5.6 5.6 0 1 0 8.63 7.14 5.6 5.6 0 1 0-8.63-7.14zM279.28 24.71a5.6 5.6 0 1 0 8.63 7.15 5.6 5.6 0 1 0-8.63-7.15zM291.61 34.92a5.6 5.6 0 1 0 8.62 7.15 5.6 5.6 0 1 0-8.62-7.15zM219.79-3.8a5.6 5.6 0 1 0 8.63 7.15 5.6 5.6 0 1 0-8.63-7.15zM232.11 6.41a5.6 5.6 0 1 0 8.63 7.15 5.6 5.6 0 1 0-8.63-7.15zM244.44 16.62a5.6 5.6 0 1 0 8.62 7.14 5.6 5.6 0 1 0-8.62-7.14zM256.76 26.83a5.6 5.6 0 1 0 8.62 7.14 5.6 5.6 0 1 0-8.62-7.14z' stroke='%23d3b714' stroke-width='1.71' stroke-dasharray='4%2c 4'%3e%3c/path%3e%3crect width='98.80000000000001' height='98.80000000000001' clip-path='url(%26quot%3b%23SvgjsClipPath1110%26quot%3b)' x='984.55' y='392.31' fill='url(%26quot%3b%23SvgjsPattern1111%26quot%3b)' transform='rotate(27.34%2c 1033.95%2c 441.71)'%3e%3c/rect%3e%3cpath d='M268.57 420.74 L202.41 417.64L265.42877878312066 389.25122121687934z' fill='%23e73635'%3e%3c/path%3e%3cpath d='M1122.24 306.56 L1082.49 409.73L1056.8364678387247 312.6164678387246z' fill='%23037b0b'%3e%3c/path%3e%3crect width='175.12' height='175.12' clip-path='url(%26quot%3b%23SvgjsClipPath1112%26quot%3b)' x='1021.06' y='226.64' fill='url(%26quot%3b%23SvgjsPattern1113%26quot%3b)' transform='rotate(248.14%2c 1108.62%2c 314.2)'%3e%3c/rect%3e%3crect width='183' height='183' clip-path='url(%26quot%3b%23SvgjsClipPath1114%26quot%3b)' x='444.52' y='207.26' fill='url(%26quot%3b%23SvgjsPattern1115%26quot%3b)' transform='rotate(333.68%2c 536.02%2c 298.76)'%3e%3c/rect%3e%3cpath d='M368.82000000000005 639.1600000000001 L470.17 550.1800000000001L474.8931908267283 650.0681908267284z' stroke='%23d3b714' stroke-width='1.77' stroke-dasharray='3%2c 3'%3e%3c/path%3e%3crect width='96' height='96' clip-path='url(%26quot%3b%23SvgjsClipPath1116%26quot%3b)' x='1239.57' y='32.3' fill='url(%26quot%3b%23SvgjsPattern1117%26quot%3b)' transform='rotate(206.34%2c 1287.57%2c 80.3)'%3e%3c/rect%3e%3cpath d='M1273.51 155.08 L1283.77 198.13L1302.8313773509399 152.41362264906002z' fill='%23e73635'%3e%3c/path%3e%3cpath d='M517.8 192.62 L428.04999999999995 140.26L400.73301335954915 238.6319866404508z' stroke='%23e73635' stroke-width='1' stroke-dasharray='3%2c 3'%3e%3c/path%3e%3ccircle r='46.666666666666664' cx='482.8' cy='180.53' fill='%23d3b714'%3e%3c/circle%3e%3crect width='144' height='144' clip-path='url(%26quot%3b%23SvgjsClipPath1118%26quot%3b)' x='-40.26' y='210.33' fill='url(%26quot%3b%23SvgjsPattern1119%26quot%3b)' transform='rotate(332.2%2c 31.74%2c 282.33)'%3e%3c/rect%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1109'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cpattern x='0' y='0' width='9.88' height='9.88' patternUnits='userSpaceOnUse' id='SvgjsPattern1111'%3e%3cpath d='M0 9.88L4.94 0L9.88 9.88' stroke='%23037b0b' fill='none'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1110'%3e%3ccircle r='24.700000000000003' cx='1033.95' cy='441.71'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='7.96' height='7.96' patternUnits='userSpaceOnUse' id='SvgjsPattern1113'%3e%3cpath d='M0 7.96L3.98 0L7.96 7.96' stroke='%23e73635' fill='none'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1112'%3e%3ccircle r='43.78' cx='1108.62' cy='314.2'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='6.1' height='6.1' patternUnits='userSpaceOnUse' id='SvgjsPattern1115'%3e%3cpath d='M3.05 1L3.05 5.1M1 3.05L5.1 3.05' stroke='%23d3b714' fill='none' stroke-width='1.78'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1114'%3e%3ccircle r='45.75' cx='536.02' cy='298.76'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='6' height='6' patternUnits='userSpaceOnUse' id='SvgjsPattern1117'%3e%3cpath d='M3 1L3 5M1 3L5 3' stroke='%23037b0b' fill='none' stroke-width='1.71'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1116'%3e%3ccircle r='24' cx='1287.57' cy='80.3'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='6' height='6' patternUnits='userSpaceOnUse' id='SvgjsPattern1119'%3e%3cpath d='M3 1L3 5M1 3L5 3' stroke='%23d3b714' fill='none' stroke-width='1'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1118'%3e%3ccircle r='36' cx='31.74' cy='282.33'%3e%3c/circle%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e")`,
                backgroundColor: "ghostwhite"
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
                <div
                    hidden={isVerifying}
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                        padding: "2vw",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            width: "100%",
                            maxWidth: "400px",
                        }}
                    >
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            style={{
                                ...formStyles,
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            <h2
                                className="login-page-title"
                                style={{
                                    textAlign: "center",
                                    marginBottom: "1.5rem",
                                    fontSize: "1.6rem",
                                    fontWeight: "bold",
                                }}
                            >
                                Login
                            </h2>
                            <div style={{ marginBottom: "1rem" }}>
                                <label
                                    className="login-page-label"
                                    style={{
                                        ...labelStyles,
                                        fontSize: "1rem",
                                    }}
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <input
                                    className={errors.email ? "input1-error" : "input1"}
                                    id="email"
                                    autoComplete="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="Enter your email"
                                    minLength={11}
                                    maxLength={100}
                                    style={{
                                        fontSize: ".98rem",
                                        width: "100%",
                                    }}
                                />
                                {errors.email && (
                                    <p style={errorStyles}>{errors.email.message}</p>
                                )}
                            </div>
                            <div style={{ marginBottom: "1rem", position: "relative" }}>
                                <label
                                    className="login-page-label"
                                    style={{
                                        ...labelStyles,
                                        fontSize: "1rem",
                                    }}
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <div className="login-password">
                                    <input
                                        className={errors.password ? "input2-error " : "input2"}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        placeholder="Enter your password"
                                        maxLength={24}
                                        style={{
                                            fontSize: ".98rem",
                                            width: "100%",
                                            border: "none",
                                        }} />
                                    <button
                                        type="button"
                                        className="eye-icon-login-password"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        onClick={() => setShowPassword((prev) => !prev)}
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
                                        {showPassword ? (
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
                            <button
                                className="button1"
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    fontSize: "clamp(.93rem, 1.2vw, 1.2rem)",
                                    width: "100%",
                                    marginTop: "0.5rem",
                                }}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                            <p
                                style={{
                                    textAlign: "center",
                                    marginTop: "1rem",
                                    fontSize: "clamp(0.9rem, 1vw, 1.05rem)",
                                }}
                            >
                                Don't have an account?
                                <Link
                                    to="/signup"
                                    style={{
                                        color: "#6366f1",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        marginLeft: "0.5rem",
                                        fontSize: "inherit",
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
                <style>
                    {`
            @media (max-width: 600px) {
                form {
                    padding: 1.2rem !important;
                    min-width: unset !important;
                    }
                .eye-icon-login-password {
                    top: 2.2rem !important;
                    }
                .login-page-title {
                    font-size: 1.3rem !important;
                    }
                .login-page-label {
                        font-size: .9rem !important;
                    }
                .input1, .input2, .input1-error, .input2-error {
                    font-size: .9rem !important;
                    }
            }
            `}
                </style>
            </section>
        </>
    );
};

export default LoginPage;