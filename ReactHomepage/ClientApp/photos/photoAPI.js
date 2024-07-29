// A mock function to mimic making an async request for data
import * as apiClient from "../helpers/ApiHelpers";

export async function getPhotosFromServerAsync(albumId) {
  return new Promise((resolve, reject) =>
    apiClient.postHelper('/Photos/Index/' + albumId)
      .then((response) => {
        return resolve({ data: response });
      }).catch((error) => {
        return reject(error);
      }))
}

export async function deletePhotoOnServerAsync(photoId, albumId) {
  return new Promise((resolve, reject) =>
    apiClient.getHelper('/Handler/Delete/' + photoId + '/' + albumId)
      .then((response) => {
        return resolve({ data: response });
      }).catch((error) => {
        return reject(error);
      }))
}

export async function updatePhotoCaptionOnServerAsync(photoId, caption) {
  return new Promise((resolve, reject) =>
    apiClient.getHelper('/Handler/Save/' + photoId + '/' + caption)
      .then((response) => {
        return resolve({ data: response });
      }).catch((error) => {
        return reject(error);
      }))
}

