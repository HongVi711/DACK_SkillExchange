
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/HomePage/Home';
import SchedulePage from './pages/SchedulePage/SchedulePage';

function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />  
        <Route path="schedule" element={<SchedulePage />} />  
      </Routes>
    </Router>
  )
}
export default App
