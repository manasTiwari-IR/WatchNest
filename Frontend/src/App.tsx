import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} ></Route>
          <Route path="/login" element={<LoginPage />} ></Route>
          <Route path="/signup" element={<SignUpPage />} ></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App
