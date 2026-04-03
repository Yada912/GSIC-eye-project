export interface User {
  id: string;
  email: string;
  name: string;
}

export const getUser = (): User | null => {
  const userData = localStorage.getItem("eyecare_user");
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};

export const setUser = (user: User): void => {
  localStorage.setItem("eyecare_user", JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem("eyecare_user");
};
