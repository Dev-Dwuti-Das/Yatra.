import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchListings } from '../api/listingApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import pic8 from '../../pic8.jpg';
import pic10 from '../../pic10.jpg';
import pic32 from '../../pic32.jpg';

const fallbackImages = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1400&q=80'
];

function getImage(item, index) {
  return item?.image?.url || fallbackImages[index % fallbackImages.length];
}

function formatInr(value) {
  const number = Number(value || 0);
  return number.toLocaleString('en-IN');
}

function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;

    return listings.filter((item) => {
      return (
        item.title?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.country?.toLowerCase().includes(q)
      );
    });
  }, [listings, query]);

  const featured = filtered[0] || listings[0];
  const recommended = filtered[1] || listings[1];
  const topFind = filtered[2] || listings[2];

  return (
    <section className="landing-page">
      <div className="lux-hero-grid">
        <div className="hero-copy">
          <h1 className="hero_text ">Luxury villas designed for remarkable stays.</h1>
          <p className="para">
            Discover architect-led homes with refined interiors, panoramic views, and seamless hospitality in the
            world&apos;s most desirable destinations.
          </p>

          <div className="hero-stats">
            <div>
              <strong>{listings.length}+</strong>
              <span>Curated villas</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>Average guest rating</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Concierge support</span>
            </div>
          </div>

          <form className="searchbar hero-search-under-stats" role="search" onSubmit={(e) => e.preventDefault()}>
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
        </div>

        <div className="hero-image-wrap">
          <div className="hero-main-image-wrap">
            <img className="landing_page_img" src={pic32} alt="Featured villa" />
            <div className="hero-img-title">Exceptional properties around the globe</div>
            <button className="hero-cta-btn" type="button">
              Show Top Rated Villas <i className="fa-solid fa-location-arrow" />
            </button>
          </div>

          <div className="hero-stats-pill">
            <span>6900+</span>
            <span>Unique places</span>
          </div>

          <div className="hero-secondary-grid">
            <div className="hero-secondary-card">
              <img src={getImage(recommended, 1)} alt={recommended?.title || 'Recommended Places'} />
              <div className="hero-secondary-label">Recommended Places</div>
              <button className="hero-pin-btn" type="button" aria-label="Recommended place">
                <i className="fa-solid fa-location-dot" />
              </button>
            </div>
            <div className="hero-secondary-card">
              <img src={getImage(topFind, 2)} alt={topFind?.title || 'Top Finds'} />
              <div className="hero-secondary-label">Top Finds</div>
              <button className="hero-pin-btn" type="button" aria-label="Top find">
                <i className="fa-solid fa-location-dot" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-copy hero-copy-exact">
        <h1 className="hero_text hero_text_exact">
          <span className="hero-line">Make your move and discover</span>
          <span className="hero-line hero-line-with-images">
            <span className="inline-photo" aria-hidden="true">
              <img
                src={pic10}
                alt=""
              />
            </span>
            <span>the world</span>
            <span className="inline-photo" aria-hidden="true">
              <img
                src={pic8}
                alt=""
              />
            </span>
            <span>that&apos;s</span>
          </span>
          <span className="hero-line">waiting for you.</span>
        </h1>
      </div>

      <div className="grid-head">
        <h2>Exceptional stays</h2>
        <p>Square-gallery collection of premium villas</p>
      </div>

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
                  <img src={item?.image?.url || getImage(item, index)} alt={item.title || 'Villa listing'} />
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

export default ListingsPage;
