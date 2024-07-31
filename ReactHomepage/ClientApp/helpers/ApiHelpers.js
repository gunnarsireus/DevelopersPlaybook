let queryString;
import('query-string').then(module => {
  queryString = module.default;
});

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Language": "*"
};

const getQueryString = (query) => {
  if (!query) return "";

  const stringifiedQuery = queryString.stringify(query);

  return `?${stringifiedQuery}`;
}

export const getHelper = async (url, query) => {
  url = `${url}${getQueryString(query)}`;

  const response = await fetch(url, {
    headers: defaultHeaders,
    method: "GET"
  });

  if (!response.ok) throw response;

  return response.json();
}

export const postHelper = async (url, request, query) => {
  url = `${url}${getQueryString(query)}`;

  const response = await fetch(url, {
    headers: defaultHeaders,
    method: "POST",
    body: request ? JSON.stringify(request) : null
  });

  if (!response.ok) throw response;

  return response.json();
}

export const postImageHelper = async (url, formData, query) => {
  url = `${url}${getQueryString(query)}`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    },
    method: "POST",
    body: formData
  });

  if (!response.ok) throw response;

  return response.json();
}

export const putHelper = async (url, request, query) => {
  url = `${url}${getQueryString(query)}`;

  const response = await fetch(url, {
    headers: defaultHeaders,
    method: "PUT",
    body: request ? JSON.stringify(request) : null
  });

  if (!response.ok) throw response;

  return response.json();
}

export const patchHelper = async (url, request, query) => {
  url = `${url}${getQueryString(query)}`;

  const response = await fetch(url, {
    headers: defaultHeaders,
    method: "PATCH",
    body: request ? JSON.stringify(request) : null
  });

  if (!response.ok) throw response;

  return response.json();
}

export const deleteHelper = async (url, query) => {
  url = `${url}${getQueryString(query)}`;

  const response = await fetch(url, {
    headers: defaultHeaders,
    method: "DELETE"
  });

  if (!response.ok) throw response;

  return response.json();
}
