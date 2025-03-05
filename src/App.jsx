
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/HomePage/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import Search from './pages/SearchPage/Search';
function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />}/>
      </Routes>
    </Router>
  )
}
export default App
