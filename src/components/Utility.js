export const client_id = "0ed447cbcf7f21fe2572ce266fc0ce26";

export const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

export const deleteCookieValue = (name) =>
  (document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
export const setCookieValue = (name, value, maxAge) =>
  (document.cookie = `${name}=${value}; max-age=${maxAge};`);
