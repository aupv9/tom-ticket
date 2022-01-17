export const isBrowser = () => typeof window !== 'undefined';
export const getUser = () =>
  isBrowser() && window.localStorage.getItem('user')
    ? JSON.parse(window.localStorage.getItem('user'))
    : {};

export const setToken = token =>
  window.localStorage.setItem('token', JSON.stringify(token));
export const removeUser = () => window.localStorage.removeItem('token');
export const isLoggedIn = () => {
  const user = getUser();
  return !!user.username;
};
