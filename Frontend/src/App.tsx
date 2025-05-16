import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CustomProvider } from 'rsuite';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <CustomProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>} ></Route>
          <Route path="/login" element={<LoginPage />} ></Route>
          <Route path="/signup" element={<SignUpPage />} ></Route>
          <Route path="/home" element={<Home />} ></Route>
        </Routes>
      </Router>
    </CustomProvider>
  );
};

export default App;
