
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Chrome, Apple } from 'lucide-react';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';

const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'var(--secondary)',
    borderColor: 'var(--border)',
    borderRadius: '0.375rem',
    minHeight: '40px',
    color: 'var(--foreground)',
    boxShadow: 'none',
    '&:hover': { borderColor: 'var(--ring)' },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--forest-green)'
      : state.isFocused
      ? 'var(--accent)'
      : 'var(--card)',
    color: state.isSelected ? 'white' : 'var(--foreground)',
    ':active': { backgroundColor: 'var(--forest-green-light)' },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--foreground)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--card)',
    color: 'var(--foreground)',
    zIndex: 9999,
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid var(--border)',
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: 'var(--card)',
    padding: 0,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--foreground)',
  }),
};

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const isSignUpFromQuery = queryParams.get('signup') === 'true';

  const [isLogin, setIsLogin] = useState(!isSignUpFromQuery);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, signInWithOAuth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsLogin(!isSignUpFromQuery);
  }, [isSignUpFromQuery]);

  const roleOptions = [
    { value: 'athlete', label: 'Athlete' },
    { value: 'business_owner', label: 'Business Owner' },
    { value: 'director', label: 'NIL Director' },
  ];

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    await signInWithOAuth(provider);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: error.message,
        });
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    } else {
      if (password !== confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: 'Passwords do not match.',
        });
        setLoading(false);
        return;
      }
      if (!role) {
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: 'Please select your role.',
        });
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password, {
        data: { full_name: fullName, role: role.value },
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: error.message,
        });
        setLoading(false);
      } else {
        navigate('/quiz');
        setLoading(false);
      }
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-background py-12">
      <Helmet>
        <title>Rootd - {isLogin ? 'Login' : 'Sign Up'}</title>
        <meta name="description" content="Login or Sign Up for Rootd." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 space-y-8 bg-card rounded-2xl shadow-lg border border-border"
      >
        <div className="text-center">
          <img
            src="https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/20e355a5f82f9c695c1b6c7a425bf1c4.png"
            alt="Rootd Logo"
            className="h-12 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-foreground">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin
              ? 'Sign in to continue your journey.'
              : 'Join the Rootd community today.'}
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <Chrome className="w-5 h-5 mr-2" /> Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('apple')}
            disabled={loading}
          >
            <Apple className="w-5 h-5 mr-2" /> Apple
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-foreground">
                  I am a...
                </Label>
                <Select
                  id="role"
                  options={roleOptions}
                  value={role}
                  onChange={setRole}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                  menuPortalTarget={document.body}
                  placeholder="Select your role..."
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full forest-green hover:bg-forest-green-light text-white py-3 text-lg font-semibold rounded-full shadow-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isLogin ? (
              'Login'
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
