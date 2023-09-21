const ID_TOKEN_KEY = "id_token";
const ID_STANDALONE = "id_standalone";
const ID_FileStorageLocation = "id_fileStorageLocation";

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveToken = (token) => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};
export const saveStandalone = (satndalone) => {
  window.localStorage.setItem(ID_STANDALONE, satndalone);
};
export const getStandalone = () => {
  return window.localStorage.getItem(ID_STANDALONE);
};

export const saveFileStorageLocation = (fileStorageLocation) => {
  window.localStorage.setItem(ID_FileStorageLocation, fileStorageLocation);
};
export const getFileStorageLocation = () => {
  return window.localStorage.getItem(ID_FileStorageLocation);
};

export default {
  getToken,
  saveToken,
  destroyToken,
  saveStandalone,
  getStandalone,
  saveFileStorageLocation,
  getFileStorageLocation
};
