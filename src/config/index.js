export const getUpcomingAPI = (num) => {
  return fetch(
    `https://api.jikan.moe/v4/seasons/upcoming?page=${num}&sfw`
  ).then((res) => res.json().then((results) => Promise.resolve(results)));
};

export const getSeasonAPI = (year, season, num) => {
  return fetch(
    `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${num}&sfw`
  ).then((res) => res.json().then((results) => Promise.resolve(results)));
};

export const getSeasonListAPI = () => {
  return fetch(`https://api.jikan.moe/v4/seasons`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getAiringAPI = () => {
  return fetch(`https://api.jikan.moe/v4/seasons/now?sfw`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getTopAPI = (num) => {
  return fetch(`https://api.jikan.moe/v4/top/anime?page=${num}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((results) => Promise.resolve(results));
};

export const getSearchAPI = (
  keyword,
  num,
  order_by,
  sort,
  type,
  status,
  rating,
  genre,
  startDate,
  endDate
) => {
  return fetch(
    `https://api.jikan.moe/v4/anime?${keyword ? `q=${keyword}` : ""}${
      num ? `&page=${num}` : ""
    }&sfw${order_by ? `&order_by=${order_by}` : ""}${
      sort ? `&sort=${sort}` : ""
    }${type ? `&type=${type}` : ""}${status ? `&status=${status}` : ""}${
      rating ? `&rating=${rating}` : ""
    }${genre ? `&genres=${genre}` : ""}${
      startDate ? `&start_date=${startDate}` : ""
    }${endDate ? `&end_date=${endDate}` : ""}
    `
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((results) => Promise.resolve(results));
};

export const getTodayAPI = () => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date();
  let day = weekday[d.getDay()];
  return fetch(`https://api.jikan.moe/v4/schedules?filter=${day}`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getScheduleAPI = (day, num) => {
  return fetch(
    `https://api.jikan.moe/v4/schedules?filter=${day}&page=${num}&sfw`
  ).then((res) => res.json().then((results) => Promise.resolve(results)));
};

export const getAnimeGenreAPI = () => {
  return fetch(`https://api.jikan.moe/v4/genres/anime`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getDetailsAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getFullDetailsAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/full`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};
export const getVideosAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/videos`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getEpisodesAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getReviewsAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getRecommendationsAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`).then(
    (res) => res.json().then((results) => Promise.resolve(results))
  );
};

export const getRelationsAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/relations`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getPicturesAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/pictures`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getStatAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/statistics`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getCharactersAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/characters`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};
export const getStaffAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/staff`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const getMoreInfoAPI = (id) => {
  return fetch(`https://api.jikan.moe/v4/anime/${id}/moreinfo`).then((res) =>
    res.json().then((results) => Promise.resolve(results))
  );
};

export const uuid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export function capitalize(str) {
  if (!str) return "";
  const words = str.split("_");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
  }
  return words.join(" ");
}
