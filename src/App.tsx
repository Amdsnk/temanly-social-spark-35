
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AdminSecurityWrapper from "@/components/AdminSecurityWrapper";
import Index from "./pages/Index";
import Services from "./pages/Services";
import BrowseTalents from "./pages/BrowseTalents";
import TalentProfile from "./pages/TalentProfile";
import BookingPage from "./pages/BookingPage";
import HowItWorks from "./pages/HowItWorks";
import Safety from "./pages/Safety";
import FAQ from "./pages/FAQ";
import Signup from "./pages/Signup";
import TalentRegister from "./pages/TalentRegister";
import TalentRegisterSuccess from "./pages/TalentRegisterSuccess";
import UserVerification from "./pages/UserVerification";
import UserDashboard from "./pages/UserDashboard";
import TalentDashboard from "./pages/TalentDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Community from "./pages/Community";
import Rent from "./pages/Rent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/talents" element={<BrowseTalents />} />
              <Route path="/talent/:id" element={<TalentProfile />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/talent-register" element={<TalentRegister />} />
              <Route path="/talent-register-success" element={<TalentRegisterSuccess />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/community" element={<Community />} />
              <Route path="/rent" element={<Rent />} />

              {/* Protected User Routes */}
              <Route path="/booking" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/user-dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user-verification" element={
                <ProtectedRoute>
                  <UserVerification />
                </ProtectedRoute>
              } />
              <Route path="/talent-dashboard" element={
                <ProtectedRoute requiredUserType="companion">
                  <TalentDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={
                <AdminSecurityWrapper>
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                </AdminSecurityWrapper>
              } />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
