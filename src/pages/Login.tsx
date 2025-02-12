import { useState } from 'react';
import { Mail, Lock, User, GraduationCap, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [activeTab, setActiveTab] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'parent', label: 'Parent', icon: <User size={24} />, color: 'primary' },
    { id: 'teacher', label: 'Teacher', icon: <GraduationCap size={24} />, color: 'secondary' },
    { id: 'admin', label: 'Admin', icon: <Building2 size={24} />, color: 'accent' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 xl:p-24">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-2">
              Welcome to StarKid
            </h1>
            <p className="text-text-secondary text-sm lg:text-base">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Role Selection */}
          <div className="mt-8">
            <div className="bg-background rounded-2xl p-2 flex shadow-sm border border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all
                    ${activeTab === tab.id
                      ? `bg-surface text-${tab.color} shadow-sm`
                      : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-secondary/10 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-secondary">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl text-text-primary placeholder-text-tertiary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl text-text-primary placeholder-text-tertiary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary-dark focus:bg-primary-dark text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-primary/5 p-16 xl:p-24">
        <div className="h-full flex items-center justify-center">
          <img
            src="/school-illustration.svg"
            alt="School Illustration"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
