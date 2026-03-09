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
    <section className="neo-panel mx-auto max-w-xl p-6 md:p-8">
      <h3 className="panel-heading">Create listing</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" placeholder="title" value={form.title} onChange={handleChange} required />
        <textarea
          name="description"
          placeholder="description"
          value={form.description}
          onChange={handleChange}
          className="min-h-28"
        />
        <input name="price" type="number" placeholder="price" value={form.price} onChange={handleChange} required />
        <input name="location" placeholder="location" value={form.location} onChange={handleChange} required />
        <input name="country" placeholder="country" value={form.country} onChange={handleChange} required />
        <input name="image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button type="submit" disabled={loading} className="btn-lux-solid w-full justify-center">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
      {loading && <Loader text="Submitting listing..." />}
      <ErrorMessage message={error} />
    </section>
  );
}

export default CreateListingPage;
