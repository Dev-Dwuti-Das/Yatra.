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
