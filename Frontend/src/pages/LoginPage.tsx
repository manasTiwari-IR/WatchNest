import React, { useEffect } from "react";
import "../cssfiles/LoginPageStyles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
// import Toaster from "../components/Toaster";
import { useToaster, Message } from "rsuite";
import 'rsuite/dist/rsuite.min.css';

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

const LoginPage: React.FC = () => {
    const toaster = useToaster();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    if (window.location.pathname === "/") {
        const navigate = useNavigate();
        useEffect(() => {
            if (window.location.pathname === "/") {
                navigate("/login");
            }
        }, [navigate]);

    }

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        const response = await fetch("http://localhost:8001/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            toaster.push(
                (<Message showIcon closable type="error" header="Login Failed"
                    style={{ backgroundColor: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb" }}>
                    Invalid email or password. Please try again.
                </Message>),
                { placement: 'topEnd', duration: 3000 }
            );
        }
        else{
            console.log("Login successful");
            // const responseData = await response.json();
            // console.log(responseData.data);
            toaster.push(
                (<Message showIcon closable type="success" header="Login Successful"
                    style={{ backgroundColor: "#d1e7dd", color: "#0f5132", borderColor: "#b6e0f3" }}>
                    Welcome back! You have successfully logged in.
                </Message>),
                { placement: 'topEnd', duration: 1000 }
            );
        }
        reset(); // Reset the form after submission

        navigate("/home");
    };

    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"> </div> </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "transparent",
                }}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={formStyles}>
                    <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.4rem", fontWeight: "bold" }}>Login</h2>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={labelStyles} htmlFor="email">Email</label>
                        <input
                            className={errors.email ? "input1-error" : "input1"}
                            id="email"
                            type="email"
                            {...register("email")}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p style={errorStyles}>{errors.email.message}</p>
                        )}
                    </div>
                    <div style={{ marginBottom: "1rem", position: "relative" }}>
                        <label style={labelStyles} htmlFor="password">Password</label>
                        <input
                            className={errors.password ? "input2-error" : "input2"}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="Enter your password"
                            style={{ paddingRight: "2.5rem" }}
                        />
                        <button
                            type="button"
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
                                outline: "none"
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
                        disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                    <p style={{ textAlign: "center", marginTop: "1rem" }}>
                        Don't have an account?
                        <Link
                            to="/signup"
                            style={{
                                color: "#6366f1",
                                fontWeight: 600,
                                textDecoration: "none",
                                marginLeft: "0.5rem",
                            }}>
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default LoginPage;