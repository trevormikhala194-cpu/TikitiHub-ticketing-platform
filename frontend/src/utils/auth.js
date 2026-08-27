const ACCESS_TOKEN_KEY = "tikiti_access_token";
const REFRESH_TOKEN_KEY = "tikiti_refresh_token";
const USER_KEY = "tikiti_user";

export const saveAuth = (data) => {
  if (data?.access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  }

  if (data?.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  }

  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return Boolean(getAccessToken());
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};