import React, { useState } from 'react';
import axios from 'axios';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/v1/auth/register' : '/api/v1/auth/login';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('agri_token', res.data.token);
      localStorage.setItem('agri_user', JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {isRegister ? 'Create AgriPulse Account' : 'Farmer / Officer Sign In'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <User className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  required
                  placeholder="Izhan Shaikh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent text-sm w-full focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Mail className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="email"
                required
                placeholder="farmer@agripulse.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-transparent text-sm w-full focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <Lock className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-transparent text-sm w-full focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Role</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 mr-2" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-transparent text-sm w-full focus:outline-none"
                >
                  <option value="farmer">Farmer (Standard)</option>
                  <option value="admin">Agriculture Officer / Admin</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 text-sm mt-2"
          >
            {loading ? 'Processing...' : isRegister ? 'Sign Up' : 'Log In'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-emerald-700 hover:underline font-medium"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}