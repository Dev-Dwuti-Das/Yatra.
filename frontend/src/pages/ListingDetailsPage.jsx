import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchListingById } from '../api/listingApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

const fallbackImage =
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80';

function formatInr(value) {
  const number = Number(value || 0);
  return number.toLocaleString('en-IN');
}

function ListingDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const reviews = useMemo(() => {
    if (!listing) return [];
    if (Array.isArray(listing.review)) return listing.review;
    if (Array.isArray(listing.reviews)) return listing.reviews;
    return [];
  }, [listing]);

  const isOwner = useMemo(() => {
    if (!user || !listing?.owner) return false;
    const ownerId =
      typeof listing.owner === 'object'
        ? listing.owner._id || listing.owner.id
        : listing.owner;
    return String(ownerId) === String(user.id);
  }, [listing, user]);

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

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const total = reviews.reduce((sum, item) => sum + Number(item?.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);
  const ratingOptions = [1, 2, 3, 4, 5];

  if (loading) return <Loader text="Loading listing details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!listing) return <p className="no-results">Listing not found.</p>;

  return (
    <section className="details-page px-2 md:px-4">
      <div className="details-topline mb-2">
        <Link to="/listings" className="details-back-link">
          <i className="fa-solid fa-arrow-left" /> Back to listings
        </Link>
        <div className="details-topline-meta">
          <span>
            <i className="fa-solid fa-location-dot" /> {listing.location}, {listing.country}
          </span>
          <span>
            <i className="fa-solid fa-star" /> {averageRating || 'New'} ({reviews.length} reviews)
          </span>
        </div>
      </div>

      <h1 className="card-title text-md text-balance">{listing.title}</h1>
      <div className="card-details mt-3 flex flex-col items-center justify-center">
        <img src={listing?.image?.url || fallbackImage} className="card-img-top-details" alt="Listing Image" />

        <div className="card-pricing-and-data flex items-start">
          <div className="card-body">
            <h5 className="text-xl md:text-3xl font-bold">Hosted by {listing?.owner?.username || 'Host'}</h5>
            <p className="card-text mt-2 leading-relaxed text-zinc-300">
              {listing.description || 'Beautiful stay with excellent comfort and location.'}
            </p>
            <div className="details-facts-grid">
              <div>
                <span>Price</span>
                <strong>INR {formatInr(listing.price)} / night</strong>
              </div>
              <div>
                <span>Location</span>
                <strong>{listing.location || 'Prime Location'}</strong>
              </div>
              <div>
                <span>Country</span>
                <strong>{listing.country || 'India'}</strong>
              </div>
              <div>
                <span>Rating</span>
                <strong>{averageRating || 'New listing'}</strong>
              </div>
            </div>
            {isOwner && (
              <div className="details-btns mt-4 flex flex-wrap gap-2">
                <button className="btn btn-primary" type="button">
                  Edit
                </button>
                <button type="button" className="btn btn-primary">
                  Delete this post
                </button>
              </div>
            )}
          </div>
          <aside className="card-details-booking">
            <b>
              <p>&#8377; {formatInr(listing.price)}/Night</p>
            </b>
            <form className="details-booking" onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="guests"
                  name="guests"
                  min="1"
                  max="10"
                  required
                  placeholder="No. of guests"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-calendar-days" />
                </span>
                <input type="date" className="form-control" name="checkIn" />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-calendar-days" />
                </span>
                <input type="date" className="form-control" name="checkOut" />
              </div>
              <button className="btn btn-primary w-100" type="submit">
                Check availability
              </button>
            </form>
          </aside>
        </div>
      </div>

      <hr className="line mb-4 mt-4" />

      {reviews.length > 0 && (
        <div className="showcomments mt-3">
          <h1>Reviews</h1>
          <div className="row row-cols-1 row-cols-md-2 g-3 mb-5 mt-4">
            {reviews.map((review) => {
              const isReviewOwner = user && String(review?.author?._id) === String(user.id);
              const postedOn = new Date(review?.date || review?.createdAt || Date.now()).toISOString().slice(0, 10);
              return (
                <div className="col" key={review._id}>
                  <div className="reviewcard">
                    <div className="reviewcardhead">
                      <h4 className="reviewcardname ms-2">{review?.author?.username || 'Anonymous'}</h4>
                      <div className="reviewstarts">
                        <p className="starability-result" data-rating={review.rating}>
                          {'★'.repeat(Math.max(1, Math.min(5, Number(review.rating || 0))))}
                        </p>
                      </div>
                    </div>
                    <div className="reviewcardbody">
                      <p className="card-text">{review.review}</p>
                      <h6 className="revdate">Posted on : {postedOn}</h6>
                      {isReviewOwner && (
                        <button type="button" className="btn btn-primary">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="showcomments mt-3">
          <h1>Reviews</h1>
          <div className="details-empty-card mt-3 mb-5">
            No reviews yet. Be the first one to share your experience.
          </div>
        </div>
      )}

      <div className="breathingroom mt-3 mb" />

      {user && (
        <div className="postcomment col-12 col-lg-8 offset-lg-2">
          <div className="review details-review-card">
            <h1>Leave a review</h1>
            <form className="details-review-form" onSubmit={(e) => e.preventDefault()}>
              <fieldset className="review-rating-row">
                <legend className="review-label">Your rating</legend>
                <input type="radio" id="no-rate" className="sr-only" name="rating" value="0" defaultChecked />
                <div className="review-rating-options">
                  {ratingOptions.map((rating) => (
                    <div key={rating} className="review-rating-item">
                      <input type="radio" id={`first-rate${rating}`} name="rating" value={rating} className="review-radio" />
                      <label htmlFor={`first-rate${rating}`} className="review-rating-pill">
                        {'★'.repeat(rating)} <span>{rating} star{rating > 1 ? 's' : ''}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="form-floating mb-3 mt-2">
                <textarea
                  className="form-control details-review-textarea"
                  placeholder="Share what you liked, what could be better, and any tips for future guests..."
                  name="review"
                  id="floatingTextarea2"
                />
                <label htmlFor="floatingTextarea2">Write your review</label>
              </div>
              <button className="btn btn-primary details-review-submit" type="submit">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="breathingroom mt-3 mb" />

      <h1 className="mt-2">Where you'll be</h1>
      <div className="map">
        <iframe
          title="Listing map"
          src={mapUrl}
          id="map"
          className="mb-3 mt-3 w-100"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

export default ListingDetailsPage;
