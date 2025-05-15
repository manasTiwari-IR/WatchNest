import React from "react";
import "../cssfiles/LoginPageStyles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import * as yup from "yup";

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

    if (window.location.pathname === "/") {
        window.location.href = "/login";
    }
    
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginFormInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        // Handle login logic here
        
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
                    padding: "1rem",
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
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={labelStyles} htmlFor="password">Password</label>
                        <input
                            className={errors.email ? "input2-error" : "input2"}
                            id="password"
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p style={errorStyles}>{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        className="button1"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                    <p style={{ textAlign: "center", marginTop: "1rem" }}>
                        Don't have an account?
                        <a
                            href="/signup"
                            style={{
                                color: "#6366f1",
                                fontWeight: 600,
                                textDecoration: "none",
                                marginLeft: "0.5rem",
                            }}>
                            Sign Up
                        </a>
                    </p>

                </form>
            </div>
        </>
    );
};

export default LoginPage;