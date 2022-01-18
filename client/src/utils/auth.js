export const isBrowser = () => typeof window !== 'undefined';
export const getUser = () =>
  isBrowser() && window.localStorage.getItem('token')
    ? window.localStorage.getItem('token')
    : {};

export const setToken = token =>
  window.localStorage.setItem('token', JSON.stringify(token));
export const removeUser = () => window.localStorage.removeItem('token');
export const isLoggedIn = () => {
  const user = getUser();
  return !!user;
};
