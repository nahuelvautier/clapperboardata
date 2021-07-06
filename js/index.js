import getDataMovies from "./get_data_movies.js";
import getAllData from "./get_full_data.js";
import responsiveMedia from "./responsive_object.js";

const d = document;

d.addEventListener("DOMContentLoaded", (e) => {
  getDataMovies();
  getAllData();
  responsiveMedia(
    "next-arrow",
    "(min-width: 992px)",
    `<img id="next-arrow" class="next-arrow none">`,
    `<img src="assets/next-arrow.svg" id="next-arrow" class="next-arrow">`
  );
  // The function for the Previous arrow is in getDataMovies();
});