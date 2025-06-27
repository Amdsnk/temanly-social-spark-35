
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Index from './pages/Index';
import BrowseTalents from './pages/BrowseTalents';
import BookingPage from './pages/BookingPage';
import UserDashboard from './pages/UserDashboard';
import Contact from './pages/Contact';
import TalentRegister from './pages/TalentRegister';
import TalentRegisterSuccess from './pages/TalentRegisterSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminApp from './components/AdminApp';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import PaymentStatus from './pages/PaymentStatus';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/talents" element={<BrowseTalents />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/talent-register" element={<TalentRegister />} />
            <Route path="/talent-register-success" element={<TalentRegisterSuccess />} />
            <Route path="/admin" element={
              <AdminApp>
                <AdminDashboard />
              </AdminApp>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
