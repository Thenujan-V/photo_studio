import './App.css';
import {BrowserRouter ,  Routes, Route, useNavigate } from "react-router-dom";
import Logout from './pages/Logout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { ServiceDetails } from './pages/ServiceDetails';
import AddToCard from './pages/user/AddToCard';
import ProtectedRoute from './components/ProtectedRoute';
import ConfirmOrder from './pages/user/ConfirmOrder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAccount from './pages/user/UserAccount';

const Unauthorized = () => <div><h2>Unauthorized - You do not have permission to access this page.</h2></div>;

function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:category" element={<ServiceDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected route for logged-in users */}
        <Route
          path="/add-to-card"
          element={
            // <ProtectedRoute allowedRoles={['user']}>
              <AddToCard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="//confirmOrder"
          element={
            // <ProtectedRoute allowedRoles={['user']}>
              <ConfirmOrder />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/useraccount"
          element={
            // <ProtectedRoute allowedRoles={['user']}>
              <UserAccount />
            // </ProtectedRoute>
          }
        />

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
