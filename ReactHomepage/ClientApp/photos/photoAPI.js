import * as apiClient from "../helpers/ApiHelpers";

export const getPhotosFromServerAsync = (albumId) => {
  return new Promise((resolve, reject) =>
    apiClient.getHelper('/api/photos/album/' + albumId)
      .then((response) => {
        return resolve({ data: response });
      }).catch((error) => {
        return reject(error);
      }))
}

export const deletePhotoOnServerAsync = (photoId) => {
  return new Promise((resolve, reject) =>
    apiClient.deleteHelper('/api/photos/delete/' + photoId)
      .then((response) => {
        return resolve({ data: response });
      }).catch((error) => {
        return reject(error);
      }))
}

export const updatePhotoCaptionOnServerAsync = (photoId, caption) => {
  return new Promise((resolve, reject) =>
    apiClient.putHelper('/api/photos/update/' + photoId, caption)
      .then((response) => {
        return resolve({ data: response });
      }).catch((error) => {
        return reject(error);
      }))
}

