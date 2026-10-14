export const getToken = () => {
  return localStorage.getItem("vitalaware_token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("vitalaware_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to read current user:", error);
    return null;
  }
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();

  return user?.id || null;
};

export const isAuthenticated = () => {
  return Boolean(getToken() && getCurrentUser());
};

export const logout = () => {
  localStorage.removeItem("vitalaware_token");
  localStorage.removeItem("vitalaware_user");
};