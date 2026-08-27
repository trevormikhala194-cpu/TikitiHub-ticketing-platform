import api from "./api";

export const createBooking = async (bookingData) => {
  const response = await api.post(
    "bookings/",
    bookingData
  );

  return response.data;
};

export const getBookings = async () => {
  const response = await api.get(
    "bookings/"
  );

  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await api.get(
    `bookings/${bookingId}/`
  );

  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.delete(
    `bookings/${bookingId}/`
  );

  return response.data;
};