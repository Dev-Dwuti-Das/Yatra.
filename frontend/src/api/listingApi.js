import axiosClient from './axiosClient';

export async function fetchListings() {
  const { data } = await axiosClient.get('/listings');
  return data;
}

export async function fetchListingById(id) {
  const { data } = await axiosClient.get(`/listings/${id}`);
  return data;
}

export async function createListing(formData) {
  const { data } = await axiosClient.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function updateListing(id, payload) {
  const { data } = await axiosClient.put(`/listings/${id}`, payload);
  return data;
}

export async function deleteListing(id) {
  const { data } = await axiosClient.delete(`/listings/${id}`);
  return data;
}

export async function checkListingAvailability(id, payload) {
  const { data } = await axiosClient.post(`/listings/${id}/availability`, payload);
  return data;
}

export async function createListingReview(id, payload) {
  const { data } = await axiosClient.post(`/listings/${id}/reviews`, payload);
  return data;
}
