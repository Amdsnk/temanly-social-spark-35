import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Rent from "./pages/Rent";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Safety from "./pages/Safety";
import Help from "./pages/Help";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import TalentDashboard from "./pages/TalentDashboard";
import UserDashboard from "./pages/UserDashboard";
import BookingPage from "./pages/BookingPage";
import TalentProfile from "./pages/TalentProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TalentRegister from "./pages/TalentRegister";
import TalentRegisterSuccess from "./pages/TalentRegisterSuccess";
import BrowseTalents from "./pages/BrowseTalents";
import HowItWorks from "./pages/HowItWorks";
import SignupSuccess from "./pages/SignupSuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/help" element={<Help />} />
              <Route path="/community" element={<Community />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/talents" element={<BrowseTalents />} />
              <Route path="/talent/:id" element={<TalentProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup-success" element={<SignupSuccess />} />
              <Route path="/talent-register" element={<TalentRegister />} />
              <Route path="/talent-register-success" element={<TalentRegisterSuccess />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              
              {/* Protected Routes */}
              <Route path="/user-dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/talent-dashboard" element={
                <ProtectedRoute>
                  <TalentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/booking" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
