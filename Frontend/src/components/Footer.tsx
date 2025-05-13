import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="footer p-6 bg-amber-200" >
            <Link to="/contact" >Contact</Link>
        </div>
    );
}

export default Footer;