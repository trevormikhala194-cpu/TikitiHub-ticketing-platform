import api from "./api";

export const getEvents = async () => {
  const response = await api.get("events/");
  return response.data;
};

export const getEvent = async (eventId) => {
  const response = await api.get(`events/${eventId}/`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("events/categories/");
  return response.data;
};

export const getVenues = async () => {
  const response = await api.get("events/venues/");
  return response.data;
};