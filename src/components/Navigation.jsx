import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const NavLink = ({ children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-green"
          layoutId="underline"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
};

const Navigation = ({ profile }) => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/demo', label: 'View Demo' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/nil-director', label: 'NIL Director Portal' },
    { to: '/about', label: 'About' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img className="h-8 w-auto" src="https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/rootd-1200-x-300-px-eGQfN.svg" alt="Rootd Logo" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map(item => (
                  <NavLink key={item.to} to={item.to}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Button asChild variant="ghost"><Link to="/dashboard">Dashboard</Link></Button>
                  <Button onClick={handleSignOut} className="forest-green hover:bg-forest-green-light text-white">Sign Out</Button>
                </div>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/auth">Login</Link>
                  </Button>
                  <Button asChild className="forest-green hover:bg-forest-green-light text-white">
                    <Link to="/auth?signup=true">Take the Quiz</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-card shadow-lg border-b border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-border">
              <div className="px-5">
                {user ? (
                  <div className="space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start"><Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link></Button>
                    <Button onClick={handleSignOut} className="w-full forest-green hover:bg-forest-green-light text-white">Sign Out</Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="w-full forest-green hover:bg-forest-green-light text-white">
                      <Link to="/auth?signup=true" onClick={() => setMobileMenuOpen(false)}>Take the Quiz</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;