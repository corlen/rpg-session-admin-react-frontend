import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/rolls/";

export function getRollsBySession(sessionId) {
  return fetch(baseUrl + sessionId)
    .then(handleResponse)
    .catch(handleError);
}

export function saveRoll(roll) {
  console.log("como é passado pra api", JSON.stringify(roll));
  return fetch(baseUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(roll)
  })
    .then(handleResponse)
    .catch(handleError);
}
