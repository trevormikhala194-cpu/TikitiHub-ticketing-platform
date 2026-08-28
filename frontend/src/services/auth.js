import api from "./api";

// =========================
// OTP AUTHENTICATION
// =========================

export const requestOTP = async (identifier, purpose) => {
  const response = await api.post("accounts/otp/request/", {
    identifier,
    purpose,
  });

  return response.data;
};

export const verifyOTP = async (
  identifier,
  otp_code,
  purpose
) => {
  const response = await api.post("accounts/otp/verify/", {
    identifier,
    otp_code,
    purpose,
  });

  return response.data;
};


// =========================
// OLD AUTH ENDPOINTS
// Keep for now
// =========================

export const registerUser = async (userData) => {
  const response = await api.post(
    "accounts/register/",
    userData
  );

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post(
    "accounts/login/",
    credentials
  );

  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await api.post(
    "accounts/logout/",
    {
      refresh: refreshToken,
    }
  );

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(
    "accounts/profile/"
  );

  return response.data;
};