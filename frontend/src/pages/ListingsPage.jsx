import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchListings } from '../api/listingApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const fallbackImages = [
  'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80'
];

const lineOverlay = 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent';

function getImage(item, index) {
  return item?.image?.url || fallbackImages[index % fallbackImages.length];
}

function CardLink({ to, className, children }) {
  if (!to) return <div className={className}>{children}</div>;
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
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

  const filtered = listings.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    return (
      item.title?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.country?.toLowerCase().includes(q)
    );
  });

  const featured = filtered[0];
  const recommended = filtered[1];
  const topFind = filtered[2];
  const rest = filtered.slice(1);

  return (
    <section>
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="animate-[fadeIn_.55s_ease-out]">
          <h1 className="text-[clamp(1.9rem,4.8vw,3.8rem)] font-black leading-[1.06] tracking-[-0.03em]">
            Inspiring locations to Lodge
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Create memorable travel moments by choosing a designer house with warm ambience.
          </p>
          <div className="mt-5 flex w-full max-w-[580px] items-center rounded-full border border-white/15 bg-gradient-to-r from-zinc-800/90 to-zinc-700/80 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition focus-within:border-violet-400/60 focus-within:shadow-[0_0_0_3px_rgba(109,24,255,0.22)]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search by title, location, country"
              className="w-full border-0 bg-transparent px-5 py-3 text-base text-white placeholder:text-zinc-300 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Search"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#6d18ff] text-white shadow-[0_8px_18px_rgba(109,24,255,0.45)] transition duration-200 hover:scale-105 hover:bg-violet-600 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </div>

        <aside className="flex animate-[fadeIn_.65s_ease-out] flex-col gap-3 [animation-delay:.08s]">
          <CardLink
            to={featured?._id ? `/listings/${featured._id}` : undefined}
            className="group relative min-h-[360px] overflow-hidden rounded-[24px] border border-white/15 transition duration-300 hover:translate-y-[-2px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          >
            <img
              src={getImage(featured, 0)}
              alt={featured?.title || 'Exceptional properties'}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <div className={lineOverlay} />
            <div className="absolute inset-4 flex flex-col justify-between">
              <h2 className="max-w-[420px] text-[clamp(1.5rem,2.4vw,2.3rem)] font-bold leading-[1.1] tracking-[-0.02em]">
                Exceptional properties around the globe
              </h2>
              <button
                type="button"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/55 bg-white/45 px-5 py-2.5 text-base font-bold text-slate-900 shadow-[0_14px_34px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl backdrop-saturate-200 transition duration-200 hover:translate-y-[-1px] hover:bg-white/60 active:translate-y-[1px]"
              >
                Show Top Rated Villas <span>↗</span>
              </button>
            </div>
          </CardLink>

          <div className="flex items-center justify-between rounded-full bg-[#eceff3] px-5 py-2 text-[1.2rem] font-bold text-slate-900">
            <span>6900+</span>
            <span>Unique places</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <CardLink
              to={recommended?._id ? `/listings/${recommended._id}` : undefined}
              className="group relative min-h-[150px] overflow-hidden rounded-[16px] border border-white/15 transition duration-300 hover:translate-y-[-2px] hover:shadow-[0_14px_30px_rgba(0,0,0,0.32)]"
            >
              <img
                src={getImage(recommended, 1)}
                alt={recommended?.title || 'Recommended Places'}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className={lineOverlay} />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <h4 className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-bold leading-tight">Recommended Places</h4>
                <span className="inline-flex h-9 w-9 items-center justify-center self-start rounded-full bg-[#fff8f0d1] text-lg text-slate-900 transition group-hover:scale-110">
                  ⌖
                </span>
              </div>
            </CardLink>

            <CardLink
              to={topFind?._id ? `/listings/${topFind._id}` : undefined}
              className="group relative min-h-[150px] overflow-hidden rounded-[16px] border border-white/15 transition duration-300 hover:translate-y-[-2px] hover:shadow-[0_14px_30px_rgba(0,0,0,0.32)]"
            >
              <img
                src={getImage(topFind, 2)}
                alt={topFind?.title || 'Top Finds'}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className={lineOverlay} />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <h4 className="text-[clamp(0.95rem,1.2vw,1.25rem)] font-bold leading-tight">Top Finds</h4>
                <span className="inline-flex h-9 w-9 items-center justify-center self-start rounded-full bg-[#fff8f0d1] text-lg text-slate-900 transition group-hover:scale-110">
                  ⌖
                </span>
              </div>
            </CardLink>
          </div>
        </aside>
      </div>

      <section className="mb-4">
        <h3 className="text-[clamp(1.35rem,3.2vw,2rem)] font-bold">Featured Properties</h3>
      </section>

      <section className="my-9">
        <h2 className="m-0 flex flex-wrap items-center gap-3 text-[clamp(1.5rem,4.8vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em]">
          <span>Make your move and discover</span>
          <span className="inline-flex h-12 w-24 overflow-hidden rounded-full border border-white/15 max-sm:h-10 max-sm:w-20">
            <img
              src="https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=500&q=80"
              alt="Tropical destination"
              className="h-full w-full object-cover"
            />
          </span>
          <span>the world</span>
          <span className="inline-flex h-12 w-24 overflow-hidden rounded-full border border-white/15 max-sm:h-10 max-sm:w-20">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
              alt="Mountain destination"
              className="h-full w-full object-cover"
            />
          </span>
          <span>that's waiting for you.</span>
        </h2>
      </section>

      {loading && <Loader text="Loading listings..." />}
      <ErrorMessage message={error} />
      {!loading && !error && filtered.length === 0 && <p className="text-slate-300">No listings found.</p>}

      {!loading && !error && (
        <div className="mt-2 grid grid-cols-1 gap-6 px-1 pb-5 pt-2 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((item, index) => (
            <Link
              to={`/listings/${item._id}`}
              className="group relative min-h-[230px] overflow-hidden rounded-[18px] border border-white/15 transition duration-300 hover:translate-y-[-3px] hover:shadow-[0_18px_38px_rgba(0,0,0,0.34)]"
              key={item._id}
            >
              <img
                src={item?.image?.url || getImage(item, index + 1)}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
              />
              <div className={lineOverlay} />
              <div className="absolute inset-x-4 bottom-4">
                <h4 className="text-xl font-extrabold">{item.title}</h4>
                <p className="mt-1 text-slate-200">
                  {item.location}, {item.country}
                </p>
                <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm transition group-hover:bg-white/30">
                  ₹ {item.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default ListingsPage;
