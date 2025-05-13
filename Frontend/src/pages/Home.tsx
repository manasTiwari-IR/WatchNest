import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Home = () => {
    return (
        <>
            <Navbar />
            <h1>Welcome to the Home Page</h1>
            <p>
                This is the home page of our application. You can navigate to different sections using the links above.
            </p>
            <Footer />
        </>
    );
};

export default Home;
