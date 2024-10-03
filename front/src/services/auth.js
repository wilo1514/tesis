export const setAuthData = (token, nameUser, idUser) => {
  localStorage.setItem('token', token);
  localStorage.setItem('nameUser', nameUser);
  localStorage.setItem('idUser', idUser);
};

export const getAuthData = () => {
  const token = localStorage.getItem('token');
  const nameUser = localStorage.getItem('nameUser');
  const idUser = localStorage.getItem('idUser');
  return { token, nameUser, idUser };
};

export const removeAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('nameUser');
  localStorage.removeItem('idUser');
};

export const isAuthenticated = () => {
  const authData = getAuthData();
  return authData.token !== null;
};

  