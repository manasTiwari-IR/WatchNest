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
        .min(6, "Password must be at least 6 characters"),
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
    const { redirectTo } = (location.state as SignupProps) || {};
    const [isVerifying, setIsVerifying] = React.useState(true);

    const verifyRefreshToken = async () => {
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
            const response = await fetch("http://localhost:8001/api/v1/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include" // Include cookies in the request
            });

            if (!response.ok) {
                console.error("SignUp failed:", response);
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
                    await storeReduxData(JSON.stringify(responseData.data.loggedInUser), responseData.data.key);
                    console.log("Data stored in Redux successfully");
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
                        { placement: 'topEnd', duration: 3000 }
                    );
                    return;
                }
                reset();
            }
        } catch (error) {
            console.error("Error during SignUp:", error);
            toaster.push(
                (<Message showIcon closable type="error" header="Internal Server Error"
                    style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                    An error occurred while signing up. Please try again.
                </Message>),
                { placement: 'topEnd', duration: 2500 }
            );
        }
    }

    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"> </div> </div>
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
                        <input
                            className={errors.password ? "input2-error" : "input2"}
                            id="password"
                            type={showPassword1 ? "text" : "password"}
                            {...register("password")}
                            placeholder="Enter your password"
                            style={{
                                paddingRight: "2.5rem",
                                fontSize: ".98rem",
                                width: "100%",
                            }}
                        />
                        <button
                            type="button"
                            className="eye-icon-login-password"
                            aria-label={showPassword1 ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword1((prev) => !prev)}
                            style={{
                                position: "absolute",
                                right: "0.75rem",
                                top: "2.45rem",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
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
                        <input
                            className={errors.confirmPassword ? "input2-error" : "input2"}
                            id="confirmPassword"
                            type={showPassword2 ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="Enter your password"
                            style={{
                                paddingRight: "2.5rem",
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
                                position: "absolute",
                                right: "0.75rem",
                                top: "2.45rem",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
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
                    <p style={{ textAlign: "center"}}>
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
                </form>
            </div>
        </>
    );
};

export default SignUpPage;