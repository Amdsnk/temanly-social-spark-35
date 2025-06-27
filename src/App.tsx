import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TalentsPage from './pages/TalentsPage';
import BookingPage from './pages/BookingPage';
import UserDashboard from './pages/UserDashboard';
import ContactPage from './pages/ContactPage';
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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/talents" element={<TalentsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
