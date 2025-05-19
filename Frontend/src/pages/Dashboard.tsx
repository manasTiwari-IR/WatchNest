import React from 'react'
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Dashboard() {
    return (
        <div>
            <Navbar />
            <h1>Welcome to the Home Page</h1>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            {/* add user data */}
            {/* fetch from Redux store */}
            <Footer />
        </div >
    )
}

export default Dashboard
