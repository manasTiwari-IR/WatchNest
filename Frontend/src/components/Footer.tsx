import React from 'react';  
const Footer: React.FC<{ styles?: React.CSSProperties }> = ({ styles }) => {
    return (
        <footer className="footer" style={styles}>
            &copy; {new Date().getFullYear()} Manas Tiwari
        </footer>
    );
}

export default Footer;