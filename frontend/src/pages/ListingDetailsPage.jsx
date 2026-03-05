import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchListingById } from '../api/listingApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const fallbackImage =
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80';

function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guests, setGuests] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchListingById(id);
        setListing(response?.data || null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const hostName = useMemo(() => {
    if (!listing) return 'rahul';
    if (typeof listing.owner === 'object' && listing.owner?.username) return listing.owner.username;
    return 'rahul';
  }, [listing]);

  const reviews = useMemo(() => {
    if (!listing) return [];
    if (Array.isArray(listing.review)) return listing.review;
    if (Array.isArray(listing.reviews)) return listing.reviews;
    return [];
  }, [listing]);

  const mapUrl = useMemo(() => {
    if (!listing) return '';

    const coords = listing?.coordinate?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      const [lng, lat] = coords;
      return `https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
    }

    const query = encodeURIComponent([listing.location, listing.country].filter(Boolean).join(', '));
    return `https://www.google.com/maps?q=${query}&z=13&output=embed`;
  }, [listing]);

  if (loading) return <Loader text="Loading listing details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!listing) return <p className="text-slate-300">Listing not found.</p>;

  return (
    <section className="pt-4">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <h1 className="text-[clamp(2.3rem,6vw,5.3rem)] font-black leading-[1.03] tracking-[-0.03em]">
            {listing.title}
          </h1>
          <p className="mt-10 text-[2rem] font-bold">₹{listing.price?.toLocaleString?.() || listing.price} / Night</p>

          <div className="mt-6 flex max-w-[430px] flex-col gap-4">
            <input
              type="number"
              placeholder="No. of guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="h-14 rounded-full border border-white/20 bg-white/10 px-5 text-lg text-white placeholder:text-slate-300 focus:border-violet-400 focus:outline-none"
            />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="h-14 rounded-full border border-white/20 bg-white/10 px-5 text-lg text-white focus:border-violet-400 focus:outline-none"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="h-14 rounded-full border border-white/20 bg-white/10 px-5 text-lg text-white focus:border-violet-400 focus:outline-none"
            />
            <button
              type="button"
              className="h-14 rounded-full bg-[#6d18ff] text-xl font-bold text-white transition hover:bg-violet-600"
            >
              Check availability
            </button>
          </div>
        </div>

        <div>
          <article className="overflow-hidden rounded-[26px] border border-white/15">
            <img
              src={listing?.image?.url || fallbackImage}
              alt={listing.title}
              className="h-[620px] w-full object-cover"
            />
          </article>

          <div className="mt-4 flex items-center justify-between rounded-full bg-[#eceff3] px-6 py-3 text-[2rem] font-bold text-slate-900">
            <span>Hosted by {hostName}</span>
            <span>Located in {listing.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-14 border-t border-white/15 pt-8">
        <h2 className="text-center text-[3rem] font-extrabold tracking-[-0.02em]">Reviews</h2>

        {reviews.length === 0 ? (
          <p className="mt-4 text-center text-lg text-slate-300">No reviews yet for this listing.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
            {reviews.map((item) => {
              const authorName = item?.author?.username || 'Anonymous';
              const rating = Math.max(1, Math.min(5, Number(item?.rating || 0)));
              const stars = '★'.repeat(rating);
              const postedOn = new Date(item?.date || item?.createdAt || Date.now()).toISOString().slice(0, 10);

              return (
                <article key={item._id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[2rem] font-semibold">{authorName}</h3>
                    <p className="text-4xl tracking-wide text-yellow-400">{stars}</p>
                  </div>

                  <p className="text-[1.9rem] leading-relaxed text-slate-100">{item.review}</p>
                  <p className="text-base text-slate-400">Posted on: {postedOn}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-center text-[3rem] font-extrabold tracking-[-0.02em]">Where you'll be</h2>
        <div className="overflow-hidden rounded-2xl border border-white/15">
          <iframe
            title="Listing map"
            src={mapUrl}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default ListingDetailsPage;
