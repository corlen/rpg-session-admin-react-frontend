import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/sessions/";

export function getSessions() {
  return fetch(baseUrl)
    .then(handleResponse)
    .catch(handleError);
}

export function getSession(id) {
  return fetch(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function saveSession(session) {
  console.log("como é passado pra api", JSON.stringify(session));
  return fetch(baseUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(session)
  })
    .then(handleResponse)
    .catch(handleError);
}
