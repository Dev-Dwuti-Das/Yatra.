import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  checkListingAvailability,
  createListingReview,
  deleteListing,
  fetchListingById,
  updateListing
} from '../api/listingApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

const fallbackImage =
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80';

function safeImageUrl(url) {
  if (!url || typeof url !== 'string') return fallbackImage;
  return /^(https?:\/\/|data:image\/|blob:|\/)/i.test(url) ? url : fallbackImage;
}

function formatInr(value) {
  const number = Number(value || 0);
  return number.toLocaleString('en-IN');
}

function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: ''
  });
  const [booking, setBooking] = useState({ guests: '', checkIn: '', checkOut: '' });
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: '0', review: '' });

  const loadListing = async () => {
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

  useEffect(() => {
    loadListing();
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

  if (loading) return <Loader text="Loading listing details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!listing) return <p className="no-results">Listing not found.</p>;

  const beginEdit = () => {
    setActionError('');
    setActionSuccess('');
    setIsEditing(true);
    setEditForm({
      title: listing.title || '',
      description: listing.description || '',
      price: String(listing.price || ''),
      location: listing.location || '',
      country: listing.country || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setSaving(true);
    try {
      const response = await updateListing(id, {
        ...editForm,
        price: Number(editForm.price)
      });
      setListing(response?.data || listing);
      setIsEditing(false);
      setActionSuccess('Listing updated successfully.');
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this listing permanently?');
    if (!confirmed) return;
    setActionError('');
    setActionSuccess('');
    setSaving(true);
    try {
      await deleteListing(id);
      navigate('/listings', { replace: true });
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to delete listing');
      setSaving(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setAvailabilityResult(null);
    setSaving(true);
    try {
      const response = await checkListingAvailability(id, {
        guests: Number(booking.guests),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      });
      setAvailabilityResult(response?.data || null);
      setActionSuccess(response?.message || 'Availability checked.');
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to check availability');
    } finally {
      setSaving(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    if (!Number(reviewForm.rating)) {
      setActionError('Please select a rating before submitting.');
      return;
    }

    if (!reviewForm.review.trim()) {
      setActionError('Please write a short review before submitting.');
      return;
    }

    setSaving(true);
    try {
      await createListingReview(id, {
        rating: Number(reviewForm.rating),
        review: reviewForm.review.trim()
      });
      setReviewForm({ rating: '0', review: '' });
      setActionSuccess('Review submitted successfully.');
      await loadListing();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

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
        <img
          src={safeImageUrl(listing?.image?.url)}
          className="card-img-top-details"
          alt="Listing Image"
          onError={(e) => {
            if (e.currentTarget.src !== fallbackImage) e.currentTarget.src = fallbackImage;
          }}
        />

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
            {isOwner && !isEditing && (
              <div className="details-btns mt-4 flex flex-wrap gap-2">
                <button className="btn btn-primary" type="button" onClick={beginEdit} disabled={saving}>
                  Edit
                </button>
                <button type="button" className="btn btn-primary" onClick={handleDelete} disabled={saving}>
                  Delete this post
                </button>
              </div>
            )}

            {isOwner && isEditing && (
              <form className="details-edit-form mt-4" onSubmit={handleUpdate}>
                <div className="details-facts-grid">
                  <input name="title" value={editForm.title} onChange={handleEditChange} placeholder="Title" required />
                  <input name="price" type="number" value={editForm.price} onChange={handleEditChange} placeholder="Price" required />
                  <input name="location" value={editForm.location} onChange={handleEditChange} placeholder="Location" required />
                  <input name="country" value={editForm.country} onChange={handleEditChange} placeholder="Country" required />
                </div>
                <textarea
                  className="form-control mt-3"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                />
                <div className="details-btns mt-3 flex flex-wrap gap-2">
                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
          <aside className="card-details-booking">
            <b>
              <p>&#8377; {formatInr(listing.price)}/Night</p>
            </b>
            <form className="details-booking" onSubmit={handleCheckAvailability}>
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
                  value={booking.guests}
                  onChange={handleBookingChange}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-calendar-days" />
                </span>
                <input type="date" className="form-control" name="checkIn" value={booking.checkIn} onChange={handleBookingChange} required />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-calendar-days" />
                </span>
                <input type="date" className="form-control" name="checkOut" value={booking.checkOut} onChange={handleBookingChange} required />
              </div>
              <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                {saving ? 'Checking...' : 'Check availability'}
              </button>
            </form>
            {availabilityResult?.available && (
              <div className="availability-result mt-3">
                Available for {availabilityResult.nights} night{availabilityResult.nights > 1 ? 's' : ''}. Total: INR{' '}
                {formatInr(availabilityResult.totalPrice)}
              </div>
            )}
          </aside>
        </div>
      </div>

      <ErrorMessage message={actionError} />
      {actionSuccess && <p className="neo-loader mt-2">{actionSuccess}</p>}

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
          <div className="review flex flex-col">
            <h1>Leave a review</h1>
            <form onSubmit={handleReviewSubmit}>
              <fieldset className="starability-checkmark mt-2">
                <input
                  type="radio"
                  id="no-rate"
                  className="input-no-rate"
                  name="rating"
                  value="0"
                  checked={reviewForm.rating === '0'}
                  onChange={handleReviewChange}
                  aria-label="No rating."
                />
                <input
                  type="radio"
                  id="first-rate1"
                  name="rating"
                  value="1"
                  checked={reviewForm.rating === '1'}
                  onChange={handleReviewChange}
                />
                <label htmlFor="first-rate1" title="Terrible">
                  1 star
                </label>
                <input
                  type="radio"
                  id="first-rate2"
                  name="rating"
                  value="2"
                  checked={reviewForm.rating === '2'}
                  onChange={handleReviewChange}
                />
                <label htmlFor="first-rate2" title="Not good">
                  2 stars
                </label>
                <input
                  type="radio"
                  id="first-rate3"
                  name="rating"
                  value="3"
                  checked={reviewForm.rating === '3'}
                  onChange={handleReviewChange}
                />
                <label htmlFor="first-rate3" title="Average">
                  3 stars
                </label>
                <input
                  type="radio"
                  id="first-rate4"
                  name="rating"
                  value="4"
                  checked={reviewForm.rating === '4'}
                  onChange={handleReviewChange}
                />
                <label htmlFor="first-rate4" title="Very good">
                  4 stars
                </label>
                <input
                  type="radio"
                  id="first-rate5"
                  name="rating"
                  value="5"
                  checked={reviewForm.rating === '5'}
                  onChange={handleReviewChange}
                />
                <label htmlFor="first-rate5" title="Amazing">
                  5 stars
                </label>
              </fieldset>
              <div className="form-floating mb-3 mt-2">
                <textarea
                  className="form-control details-review-textarea"
                  placeholder="Leave a comment here"
                  name="review"
                  id="floatingTextarea2"
                  value={reviewForm.review}
                  onChange={handleReviewChange}
                />
                <label htmlFor="floatingTextarea2">Review</label>
              </div>
              <button className="btn btn-primary mb-3" type="submit" disabled={saving}>
                {saving ? 'Submitting...' : 'Submit'}
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
