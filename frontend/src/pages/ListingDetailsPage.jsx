import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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

  if (loading) return <Loader text="Loading listing details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!listing) return <p className="no-results">Listing not found.</p>;

  return (
    <section className="details-page">
      <h1 className="card-title">{listing.title}</h1>
      <div className="card-details d-flex justify-content-center align-items-center flex-column mt-3">
        <img src={listing?.image?.url || fallbackImage} className="card-img-top-details" alt="Listing Image" />

        <div className="card-pricing-and-data d-flex align-items-center">
          <div className="card-body">
            <h5 className="card-title">Hosted by {listing?.owner?.username || 'Host'}</h5>
            <hr className="line" />
            <p>Location : {listing.location}</p>
            <p className="card-text">About : {listing.description}</p>
            <p>Country : {listing.country}</p>
            {isOwner && (
              <div className="details-btns mb-5">
                <button className="btn btn-primary" type="button">
                  Edit
                </button>
                <button type="button" className="btn btn-primary">
                  Delete this post
                </button>
              </div>
            )}
          </div>
          <div className="card-details-booking ms-5 mb-5">
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
          </div>
        </div>
      </div>

      <div className="breathingroom30px mt-3 mb" />
      <hr className="line mb-3" />

      {reviews.length > 0 && (
        <div className="showcomments">
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

      <div className="breathingroom mt-3 mb" />

      {user && (
        <div className="postcomment col-12 col-lg-6 offset-lg-3">
          <div className="review d-flex flex-column">
            <h1>Leave a review</h1>
            <form onSubmit={(e) => e.preventDefault()}>
              <fieldset className="starability-checkmark mt-2">
                <input
                  type="radio"
                  id="no-rate"
                  className="input-no-rate"
                  name="rating"
                  value="0"
                  defaultChecked
                  aria-label="No rating."
                />
                <input type="radio" id="first-rate1" name="rating" value="1" />
                <label htmlFor="first-rate1" title="Terrible">
                  1 star
                </label>
                <input type="radio" id="first-rate2" name="rating" value="2" />
                <label htmlFor="first-rate2" title="Not good">
                  2 stars
                </label>
                <input type="radio" id="first-rate3" name="rating" value="3" />
                <label htmlFor="first-rate3" title="Average">
                  3 stars
                </label>
                <input type="radio" id="first-rate4" name="rating" value="4" />
                <label htmlFor="first-rate4" title="Very good">
                  4 stars
                </label>
                <input type="radio" id="first-rate5" name="rating" value="5" />
                <label htmlFor="first-rate5" title="Amazing">
                  5 stars
                </label>
              </fieldset>
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  placeholder="Leave a comment here"
                  name="review"
                  id="floatingTextarea2"
                  style={{ width: '700px', height: '200px' }}
                />
                <label htmlFor="floatingTextarea2">Review</label>
              </div>
              <button className="btn btn-primary mb-3" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="breathingroom mt-3 mb" />

      <h1>Where you'll be</h1>
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
