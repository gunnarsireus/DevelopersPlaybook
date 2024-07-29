// A mock function to mimic making an async request for data
import * as apiClient from "../helpers/ApiHelpers";

export async function checkPasswordOnServerAsync(password) {
  return new Promise((resolve, reject) =>
    apiClient.postHelper('/Home/Login', { Password: password })
      .then((response) => {
        return resolve({ data: response.text });
      }).catch((error) => {
        return reject(error);
      }))
}

export async function logOutUserAsync() {
  return new Promise((resolve, reject) =>
    apiClient.postHelper('/Home/Logout')
      .then((response) => {
        return resolve({ data: response.text });
      }).catch((error) => {
        return reject(error);
      }))
}

