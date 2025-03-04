
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/HomePage/Home';
import SchedulePage from './pages/SchedulePage/SchedulePage';
import VideoCallPage from "./pages/VideoCallPage/VideoCallPage";

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="schedule" element={<SchedulePage />} />  
        <Route path="/videocall" element={<VideoCallPage />} />
      </Routes>
    </Router>
  )
}
export default App
