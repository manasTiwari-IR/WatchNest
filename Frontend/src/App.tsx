import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CustomProvider } from 'rsuite';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Navbar from "./components/Navbar.tsx";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ErrorPage from './pages/ErrorPage.tsx';
import { Provider } from 'react-redux';
import store from './ReduxStateManagement/store.ts';

function App() {
  return (
    <CustomProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} ></Route>
            <Route path="/login" element={<LoginPage />} ></Route>
            <Route path="/signup" element={<SignUpPage />} ></Route>
            <Route path="/dashboard" element={<Dashboard />} ></Route>
            <Route path="/error-page" element={<ErrorPage />} ></Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </Provider>
    </CustomProvider>
  );
};

export default App;
