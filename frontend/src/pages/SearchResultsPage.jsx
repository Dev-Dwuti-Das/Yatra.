import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchListings } from '../api/listingApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const fallbackImages = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80'
];

function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /^(https?:\/\/|data:image\/|blob:|\/)/i.test(url);
}

function getImage(item, index) {
  const raw = item?.image?.url;
  if (isValidImageUrl(raw)) return raw;
  return fallbackImages[index % fallbackImages.length];
}

function handleFallbackImage(index) {
  return (e) => {
    const fallback = fallbackImages[index % fallbackImages.length];
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback;
    }
  };
}

function formatInr(value) {
  const number = Number(value || 0);
  return number.toLocaleString('en-IN');
}

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchListings();
        setListings(response?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    if (!q) return listings;

    return listings.filter((item) => {
      return (
        item.title?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.country?.toLowerCase().includes(q)
      );
    });
  }, [listings, searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = query.trim();
    if (!value) {
      setSearchParams({});
      return;
    }
    setSearchParams({ q: value });
  };

  return (
    <section className="search-results-page">
      <div className="search-results-head">
        <h1 className="hero_text">Search results</h1>
        <p className="para">
          {searchParams.get('q')
            ? `Showing stays for "${searchParams.get('q')}"`
            : 'Try searching by city, country, or listing name.'}
        </p>
      </div>

      <form className="searchbar hero-search-under-stats" role="search" onSubmit={handleSubmit}>
        <input
          className="searchbox"
          type="search"
          placeholder="Search destinations, cities, or homes..."
          name="searchbox"
          aria-label="Search villas"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn-circle" type="submit" aria-label="search">
          <i className="fa-solid fa-magnifying-glass" />
        </button>
      </form>

      {loading && <Loader text="Loading listings..." />}
      <ErrorMessage message={error} />
      {!loading && !error && filtered.length === 0 && <p className="no-results">No listings found.</p>}

      {!loading && !error && (
        <div className="lux-listing-grid">
          {filtered.map((item, index) => (
            <article
              className="listingcard listingcard-animated"
              key={item._id}
              style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}
            >
              <Link to={`/listings/${item._id}`} className="listing-link">
                <div className="listing-image-wrap">
                  <img
                    src={getImage(item, index)}
                    alt={item.title || 'Villa listing'}
                    onError={handleFallbackImage(index)}
                  />
                  <span className="listing-price-badge">₹ {formatInr(item.price)}/nights</span>
                </div>
                <p className="card-title-text">{item.title}</p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchResultsPage;
