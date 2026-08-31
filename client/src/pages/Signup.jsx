import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import appConfig from '../config/appConfig';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', area: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Must be at least 6 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password, area: form.area });
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
        <h1 className="text-2xl font-bold text-center mb-1">Create your citizen account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Join {appConfig.name} to report and track civic issues.</p>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" required value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            <Input label="Email" type="email" required value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            <Input label="Area / Locality" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. Sector G-9" />
            <Input label="Password" type="password" required value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            <Input label="Confirm password" type="password" required value={form.confirmPassword} error={errors.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" />
            <Button type="submit" className="w-full" loading={loading}><UserPlus size={16} /> Sign Up</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
        <p className="text-xs text-center text-gray-400 mt-4">Officer accounts are created separately by administrators.</p>
      </div>
    </div>
  );
};

export default Signup;
