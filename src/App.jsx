
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/HomePage/Home';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />  {/* Route cho trang chủ */}
        
        {/* <Route path="*" element={<NotFoundPage />} /> Route cho các trang không tìm thấy (ví dụ) */}
      </Routes>
    </Router>
  )
}
export default App
