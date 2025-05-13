import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";


function App() {
  return (
    <>
      <Router>
        <Routes>   {/* only one route matches at a time*/}
          {/* '/' in the path name is for absolute path, without it -> relative path or child path */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App
