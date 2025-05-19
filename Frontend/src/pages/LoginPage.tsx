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
// import { useSelector } from "react-redux";
import { setUserData } from "../ReduxStateManagement/varSlice.ts";

// Validation schema
const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Min 6 characters").required("Password is required"),
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
    // const userdata = useSelector((state: any) => state.userData);
    const { redirectTo } = location.state as LoginPageProps || {};
    const toaster = useToaster();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });
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
        // no need of cleanup function here
        // because we are not using any subscriptions or intervals
    }, []);

    // decrypt the data
    // const decryptData = async (encryptedData: string, key: string) => {
    //     // Decrypt the data
    //     const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    //     const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    //     // Parse the decrypted data as JSON
    //     const parsedData = JSON.parse(decryptedData);
    //     return parsedData;
    // };

    const storeReduxData = async (data: string, key: string) => {
        // Encrypt the data
        const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
        // Store the encrypted data in Redux store  
        dispatch(setUserData({ data: encryptedData, key: key }));
    };

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await fetch("http://localhost:8001/api/v1/users/login", {
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
                        error
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
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
            </div>
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
                                type="email"
                                {...register("email")}
                                placeholder="Enter your email"
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
                            <input
                                className={errors.password ? "input2-error" : "input2"}
                                id="password"
                                type={showPassword ? "text" : "password"}
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
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword((prev) => !prev)}
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
                                {showPassword ? (
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
        </>
    );
};

export default LoginPage;