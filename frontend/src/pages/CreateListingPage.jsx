import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/listingApi';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';

function CreateListingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: ''
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append('image', image);

      await createListing(formData);
      navigate('/listings');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
      <h3 className="mb-4 text-4xl font-bold">Create Listing</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-violet-400 focus:outline-none"
        />
        <textarea
          name="description"
          placeholder="description"
          value={form.description}
          onChange={handleChange}
          className="min-h-28 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-violet-400 focus:outline-none"
        />
        <input
          name="price"
          type="number"
          placeholder="price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-violet-400 focus:outline-none"
        />
        <input
          name="location"
          placeholder="location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-violet-400 focus:outline-none"
        />
        <input
          name="country"
          placeholder="country"
          value={form.country}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-violet-400 focus:outline-none"
        />
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white file:mr-3 file:rounded-full file:border-0 file:bg-[#6d18ff] file:px-4 file:py-2 file:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#6d18ff] px-5 py-3 font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
      {loading && <Loader text="Submitting listing..." />}
      <ErrorMessage message={error} />
    </section>
  );
}

export default CreateListingPage;
