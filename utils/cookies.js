import { add } from "date-fns";

export const setCookie = (
  name,
  value,
  expires = add(new Date(), { months: 1 })
) => {
  document.cookie = `${name}=${value};expires=${expires};path=/`;
};

const getCookie = (name) => {
  const key = `${name}=`;
  const cookies = decodeURIComponent(document.cookie);
  const cookiesArray = cookies.split(";");

  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i];

    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }

    if (cookie.indexOf(key) === 0) {
      return cookie.substring(key.length, cookie.length);
    }
  }

  return null;
};

export default getCookie;
