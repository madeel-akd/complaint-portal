import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import appConfig from '../config/appConfig';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(data.role === 'officer' ? '/officer/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-3">
          <img 
            src="/assets/icon-badge-green.png" 
            alt="Citizen Complaint Portal" 
            className="h-14 w-14 rounded-2xl object-contain shadow-md"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Sign in to {appConfig.name}</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Citizens and officers both sign in here.</p>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" required value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            <Input label="Password" type="password" required value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            <Button type="submit" className="w-full" loading={loading}><LogIn size={16} /> Sign In</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account? <Link to="/signup" className="text-primary-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
        <div className="mt-5 text-xs text-center text-gray-400 space-y-0.5">
          <p>Demo citizen: citizen@gmail.com / password123456</p>
          <p>Demo officer: officer@gmail.com / password123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
