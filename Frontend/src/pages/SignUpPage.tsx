import React from "react";
import "../cssfiles/SignUpPageStyles.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type SignUpFormInputs = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const schema = yup.object().shape({
    name: yup.string().required("Name is required").min(2, "Name too short"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
});

const SignUpPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<SignUpFormInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: SignUpFormInputs) => {
        alert("Sign up successful!\n" + JSON.stringify(data, null, 2));
        reset();
    };

    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"> </div> </div>
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <h2 className="signup-title"
                        style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.4rem", fontWeight: "bold" }}>Create Account</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            {...register("name")}
                            className={errors.name ? "input-error" : ""}
                            placeholder="Enter your name"
                        />
                        {errors.name && <span className="error">{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            {...register("email")}
                            className={errors.email ? "input-error" : ""}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className={errors.password ? "input-error" : ""}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                        />
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            className={errors.confirmPassword ? "input-error" : ""}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <span className="error">{errors.confirmPassword.message}</span>
                        )}
                    </div>
                    <button type="submit" className="signup-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                    </button>
                    <p style={{ textAlign: "center", marginTop: "1rem" }}>  
                        Already have an account?
                        <a href="/login"
                            style={{
                                color: "#6366f1",
                                fontWeight: 600,
                                textDecoration: "none",
                                marginLeft: "0.5rem",
                            }}>
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </>
    );
};

export default SignUpPage;