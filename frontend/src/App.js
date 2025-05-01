import './App.css';
import {BrowserRouter ,  Routes, Route, useNavigate } from "react-router-dom";
import Logout from './pages/Logout';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';

const Unauthorized = () => <div><h2>Unauthorized - You do not have permission to access this page.</h2></div>;

function App() {
  return (
    <BrowserRouter>
    <div className="App">

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route for logged-in users */}
        {/* <Route
          path="/user-profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'admin']}>
              <UserProfile />
            </ProtectedRoute>
          }
        /> */}

        {/* Protected route for Admins */}
        {/* <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Unauthorized page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
