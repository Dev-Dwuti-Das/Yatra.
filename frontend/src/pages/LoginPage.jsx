import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/listings';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="neo-panel mx-auto max-w-xl p-6 md:p-8">
      <h3 className="panel-heading">Login</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
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
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {loading && <Loader text="Authenticating..." />}
      <ErrorMessage message={error} />
    </section>
  );
}

export default LoginPage;
