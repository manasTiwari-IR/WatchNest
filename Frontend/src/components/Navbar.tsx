import { Link, NavLink } from "react-router-dom";
import { Bomb } from "lucide-react";

const Navbar = () => {


  return (
    <>
      <nav className="p-4 bg-gray-800 text-white flex justify-between">
        <NavLink to={"/"}
          style={({ isActive }) => ({
            padding: "10px",
            borderRadius: "5px",
            textDecorationLine: isActive ? "underline" : "none",
            fontWeight: isActive ? "bold" : "normal",
            backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
            color: isActive ? "#FFD700" : "white",
            transition: "all 0.3s ease-in-out",
            boxShadow: isActive ? "0px 4px 10px rgba(255, 215, 0, 0.5)" : "none",
          })}
        >
          {/* <Bomb size={30} color="white" /> */}

          Home
        </NavLink>

        <NavLink to={"/contact"}
          style={({ isActive }) => ({
            padding: "10px",
            borderRadius: "5px",
            textDecorationLine: isActive ? "underline" : "none",
            fontWeight: isActive ? "bold" : "normal",
            backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
            color: isActive ? "#FFD700" : "white",
            transition: "all 0.3s ease-in-out",
            boxShadow: isActive ? "0px 4px 10px rgba(255, 215, 0, 0.5)" : "none",
          })}
        >Contact
        </NavLink>

        <NavLink to={"/about"}
          style={({ isActive }) => ({
            padding: "10px",
            borderRadius: "5px",
            textDecorationLine: isActive ? "underline" : "none",
            fontWeight: isActive ? "bold" : "normal",
            backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
            color: isActive ? "#FFD700" : "white",
            transition: "all 0.3s ease-in-out",
            boxShadow: isActive ? "0px 4px 10px rgba(255, 215, 0, 0.5)" : "none",
          })}
        >About</NavLink>
      </nav>
    </>
  );
};

export default Navbar;
