// A simple in-memory token store for managing the access token. It will not persist across page reloads,
let accessToken: string | null = null;

export const tokenStore = () =>
  Object.freeze({
    setAccessToken,
    getAccessToken,
    clearAccessToken,
  });

function setAccessToken(token: string) {
  accessToken = token;
  localStorage.setItem("accessToken", token);
}

function getAccessToken() {
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
}

function clearAccessToken() {
  accessToken = null;
  localStorage.removeItem("accessToken");
}
