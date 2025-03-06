
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Chat from './pages/ChatPage/Chat';
import Connect from './pages/ConnectionPage/Connect';
import Home from './pages/HomePage/Home';


function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />  {/* Route cho trang chủ */}
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Connect" element={<Connect />}/>


        {/* <Route path="*" element={<NotFoundPage />} /> Route cho các trang không tìm thấy (ví dụ) */}
      </Routes>
    </Router>
  )
}
export default App
