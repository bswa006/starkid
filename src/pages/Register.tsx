import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { UserRole } from '@/types/auth';

export default function Register() {
  const [activeRole, setActiveRole] = useState<UserRole>('teacher');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'teacher' as UserRole, label: 'Teacher', icon: <User size={24} /> },
    { id: 'admin' as UserRole, label: 'Admin', icon: <User size={24} /> },
  ] as const;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register({
        email,
        password,
        role: activeRole,
        firstName,
        lastName,
        phoneNumber,
      });
      navigate('/dashboard');
    } catch (err) {      const error = err as Error;
      setError(error.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 xl:p-24">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-2">
              Create Your Account
            </h1>
            <p className="text-text-secondary text-sm lg:text-base">
              Join StarKid and start managing your educational journey
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex justify-center gap-4 p-2 bg-surface rounded-2xl">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeRole === role.id ? 'bg-[#6B7FE3] text-white' : 'hover:bg-slate-100'}`}
              >
                {role.icon}
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={User}
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                icon={User}
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              icon={Phone}
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#6B7FE3] hover:bg-[#5A6ED0] text-white"
              loading={loading}
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#6B7FE3] hover:text-[#5A6ED0] font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image or Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#6B7FE3] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome to StarKid</h2>
          <p className="text-lg opacity-90">
            Join our community and experience a new way of managing education.
          </p>
        </div>
      </div>
    </div>
  );
}
