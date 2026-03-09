import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/listings');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="neo-panel mx-auto max-w-xl p-6 md:p-8">
      <h3 className="panel-heading">Create account</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="username" placeholder="username" value={form.username} onChange={handleChange} required />
        <input name="email" type="email" placeholder="email" value={form.email} onChange={handleChange} required />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading} className="btn-lux-solid w-full justify-center">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {loading && <Loader text="Creating account..." />}
      <ErrorMessage message={error} />
    </section>
  );
}

export default RegisterPage;
