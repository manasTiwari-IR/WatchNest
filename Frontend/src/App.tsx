import '/src/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CustomProvider } from 'rsuite';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard.tsx";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ErrorPage from './pages/ErrorPage.tsx';
import VideoFeed from "./components/VideoFeed.tsx";
import UploadPage from './pages/UploadPage.tsx';
import { Provider } from 'react-redux';
import store from './ReduxStateManagement/store.ts';
import YourVideos from './components/YourVideos.tsx';
import History from './components/History.tsx';
import Playlists from './components/Playlists.tsx';
import Profile from './components/Profile.tsx';
import VideoStream from './pages/VideoStream.tsx';

function App() {
  return (
    <CustomProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/video/:channelname/:videoid" element={<VideoStream />} />

            <Route path="/dashboard" element={<Dashboard />} >
              <Route index element={<VideoFeed />} />
              <Route path="your-videos" element={<YourVideos />} />
              <Route path="history" element={<History />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="profile/:username/:userid" element={<Profile />} />
            </Route>

            <Route path="/error-page" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </Provider>
    </CustomProvider>
    // <CustomProvider>
    //   <Provider store={store}>
    //     <Router>
    //       <Routes>
    //         <Route path="/dashboard" element={<Dashboard />} ></Route>
    //       </Routes>
    //     </Router>
    //   </Provider>
    // </CustomProvider>
  );
};

export default App;
