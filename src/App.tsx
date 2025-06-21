
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="/talent-dashboard" element={<TalentDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/talent/:id" element={<TalentProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/talent-register" element={<TalentRegister />} />
          <Route path="/talent-register-success" element={<TalentRegisterSuccess />} />
          <Route path="/talents" element={<BrowseTalents />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
