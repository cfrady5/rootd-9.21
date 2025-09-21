
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import HomePage from '@/components/pages/HomePage';
import QuizPage from '@/components/pages/QuizPage';
import TestimonialsPage from '@/components/pages/TestimonialsPage';
import NILDirectorPortal from '@/components/pages/NILDirectorPortal';
import AboutPage from '@/components/pages/AboutPage';
import AuthPage from '@/components/pages/AuthPage';
import AthleteDashboard from '@/components/pages/AthleteDashboard';
import ProfilePage from '@/components/pages/ProfilePage';
import DemoPage from '@/components/pages/DemoPage';
import NotificationsPage from '@/components/pages/NotificationsPage';
import BusinessInsightsPage from '@/components/pages/BusinessInsightsPage';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    } else {
      setProfile(null);
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching profile:", error.message);
      }
    }
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (authLoading || profileLoading) return;

    const isDemoRoute = location.pathname === '/notifications' || location.pathname === '/business-insights';
    if (isDemoRoute && location.state?.isDemo) {
      return; // Allow access to demo routes
    }

    if (user && profile) {
      if (profile.role === 'athlete' && !profile.onboarding_complete) {
        if (location.pathname !== '/quiz') navigate('/quiz');
      } else if (profile.role === 'director') {
        const allowedPaths = ['/nil-director', '/athlete-profile', '/notifications', '/business-insights'];
        if (!allowedPaths.some(path => location.pathname.startsWith(path))) {
          navigate('/nil-director');
        }
      } else if (profile.role === 'athlete' && profile.onboarding_complete) {
        const allowedPaths = ['/dashboard', '/profile'];
        if (!allowedPaths.some(path => location.pathname.startsWith(path))) {
          navigate('/dashboard');
        }
      }
    } else if (!user) {
      const protectedRoutes = ['/quiz', '/dashboard', '/profile', '/nil-director', '/notifications', '/business-insights'];
      if (protectedRoutes.some(path => location.pathname.startsWith(path))) {
        navigate('/auth');
      }
    }
  }, [user, profile, authLoading, profileLoading, location.pathname, location.state, navigate]);

  const handleBackToDashboard = () => {
    navigate('/nil-director');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center justify-center">
          <img src="https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/rootd-1200-x-300-px-eGQfN.svg" alt="Rootd Logo" className="w-40 h-auto mb-4" />
          <Loader2 className="w-8 h-8 text-forest-green animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Rootd - Connecting Athletes with Local Businesses</title>
        <meta name="description" content="The smarter way to match athletes with local businesses. Rootd in Community. Driven by Athletes." />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>
      </Helmet>
      
      <Navigation profile={profile} />
      
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage profile={profile} setProfile={setProfile} />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/nil-director" element={<NILDirectorPortal profile={profile} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/dashboard" element={<AthleteDashboard profile={profile} setProfile={setProfile} />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage profile={profile} setProfile={setProfile} />} />
              <Route path="/athlete-profile/:id" element={<ProfilePage isDirectorView={true} onBack={handleBackToDashboard} />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/business-insights" element={<BusinessInsightsPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Toaster />
    </div>
  );
}

export default App;
