import OMDBKEY from "./omdb_keys.js";
import getAllData from "./get_full_data.js";
import responsiveMedia from "./responsive_object.js";

const d = document,
  w = window;

export default function getDataMovies() {
  const $inputRequest = d.getElementById("request"),
    $showNot = d.getElementById("not"),
    $loader = d.querySelector(".loader"),
    $articleMovies = d.getElementById("article-movies"),
    $templateMovie = d.getElementById("movie-template").content,
    $articleInfo = d.getElementById("article-full-info"),
    $fragment = d.createDocumentFragment();

  let $dropDown = d.getElementById("navbarDropdown"),
    pageNumber = 1;

  const $nextArrow = d.createElement("img"),
    $prevArrow = d.createElement("img"),
    $mobileArrowsContainer = d.createElement("div"),
    $nextArrowMobile = d.createElement("img"),
    $prevArrowMobile= d.createElement("img");

  //Next arrow
  $nextArrow.setAttribute("id", "next-arrow");
  $nextArrow.classList.add("next-arrow", "none");
  $nextArrow.setAttribute("src", "assets/next-arrow.svg");
  $nextArrow.setAttribute("alt", "Next");
  //Previous arrow
  $prevArrow.setAttribute("id", "prev-arrow");
  $prevArrow.classList.add("prev-arrow", "none");
  $prevArrow.setAttribute("src", "assets/prev-arrow.svg");
  $prevArrow.setAttribute("alt", "Previous");


  //Mobile arrows container
  $mobileArrowsContainer.classList.add("mobile-arrows-container");

  //Next arrow mobile
  $nextArrowMobile.setAttribute("id", "next-arrow-mobile");
  $nextArrowMobile.classList.add("next-arrow-mobile");
  $nextArrowMobile.setAttribute("src", "assets/next-arrow.png");
  $nextArrowMobile.setAttribute("alt", "Next");
  //Previous arrow mobile
  $prevArrowMobile.setAttribute("id", "prev-arrow-mobile");
  $prevArrowMobile.classList.add("prev-arrow-mobile");
  $prevArrowMobile.setAttribute("src", "assets/prev-arrow.png");
  $prevArrowMobile.setAttribute("alt", "Previous");

  async function getMovies() {
    let typeQuery = $dropDown.textContent.toLowerCase();

    // For get all data from query search, else the string of "typeQuery" will be "All" and this will throw a logic error.
    if ($dropDown.textContent === "All") typeQuery = "";

    // This line is for "aesthetic" use of word "Movies" at the Dropdown.
    if (typeQuery.includes("movies")) typeQuery = "movie";

    try {
      $loader.classList.remove("none");
      $articleMovies.innerHTML = "";
      $articleInfo.innerHTML = "";
      $showNot.classList.add("none");

      let query = $inputRequest.value.toLowerCase(),
        api = `https://www.omdbapi.com/?s=${query}&type=${typeQuery}&page=${pageNumber}&apikey=${OMDBKEY.key}`,
        res = await fetch(api),
        json = await res.json(),
        regex = /^([ ]{1,})$/;

      //console.log(api);
      //console.log(res);
      //console.log(json);
      //console.log(json.Search);

      if (!res.ok) throw { status: res.status, statusText: res.statusText };

      if (query.length === 0 || regex.test(query)) { w.location.reload(); }

      if (json.Response === "False") {
        $showNot.classList.remove("none");
        $loader.classList.add("none");

        if (typeQuery === "") typeQuery = "all";

        $showNot.innerHTML = `
          <h3 style="color: #f00; padding-top: 10rem; padding-bottom: 5rem">
            No matches found with "${query}" at page ${pageNumber} 
            at least on the selected filter "${typeQuery}"
            <br>Please try another search.
          </h3>`;
        $articleMovies.classList.add("none");
        w.scrollTo({ behavior: "smooth", top: 250 });
      } else {
        $loader.classList.add("none");
        $showNot.classList.add("none");
        $articleMovies.classList.remove("none");

        json.Search.forEach((el) => {
          if (el.Poster === "N/A") {
            $templateMovie.querySelector(".movies-container").style.display = "none";
          } else {
            $templateMovie.querySelector(".title").textContent = el.Title;
            $templateMovie.querySelector("figure").classList.add("img-item");
            $templateMovie.querySelector("img").src = el.Poster;
            $templateMovie.querySelector("img").alt = el.Title;
            $templateMovie.querySelector(".imdb-query").name = `${el.imdbID}`;
            $templateMovie.querySelector(".imdb-query").value = "Get all info";
            if (el.Type === "game") {
              // No way to filter the type game queries from endpoint, so I wrote this code lines.
              $templateMovie.querySelector(".movies-container").style.display = "none";
            } else {
              $templateMovie.querySelector(".movies-container").style.display = "flex";
            }
          }

          let $clone = d.importNode($templateMovie, true);
          $fragment.appendChild($clone);
        });

        $articleMovies.appendChild($mobileArrowsContainer);
        $mobileArrowsContainer.appendChild($prevArrowMobile);
        $mobileArrowsContainer.appendChild($nextArrowMobile);

        $articleMovies.appendChild($prevArrow);
        $articleMovies.appendChild($fragment);
        $articleMovies.appendChild($nextArrow);

        w.scrollTo({ behavior: "smooth", top: 550 });

        if (pageNumber > 1) {
          $prevArrow.classList.remove("none");
          $prevArrowMobile.classList.remove("none");
          responsiveMedia(
            "prev-arrow",
            "(min-width: 992px)",
            `<img id="prev-arrow" class="prev-arrow none">`,
            `<img  src="assets/prev-arrow.svg" id="prev-arrow" class="prev-arrow">`
          );
        } else {
          $prevArrow.classList.add("none");
          $prevArrowMobile.classList.add("none");
        }

        if (pageNumber === 1) {
          $mobileArrowsContainer.style.justifyContent = "flex-end";
          $mobileArrowsContainer.style.marginLeft = "-12vw";
        } else {
          $mobileArrowsContainer.style.marginLeft = "0";
          $mobileArrowsContainer.style.justifyContent = "space-around";
        }
      }

      // To get info with the navbar "OK" button
      d.addEventListener("click", e => { if (e.target.matches(".imdb-query")) getAllData(); });
    } catch (err) {
      console.error(err);
      let message = err.statusText || "No data error";
      $showNot.innerHTML = "";
      $showNot.innerHTML = `
        <h3 style="color: #f00; padding-top: 10rem; padding-bottom: 5rem">
          Error ${err.status}: ${message}
        </h3>`;
    }
  }

  d.addEventListener("click", (e) => {
    //console.log(e.target);
    // This sentence will filter data from query
    if (e.target.matches(".dropdown-item")) $dropDown.textContent = e.target.textContent;

    d.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      if (e.target.matches(".next-arrow")) {
        // Sentence will get data from next page of query
        pageNumber++;
        getMovies();
        //console.log(pageNumber);
        // Sentence will get data from previous page of query
      } else if (e.target.matches(".prev-arrow")) {
        pageNumber--;
        getMovies();
        //console.log(pageNumber);
      }

      if (e.target.matches(".next-arrow-mobile")) {
        // Sentence will get data from next page of query in mobile layout
        pageNumber++;
        getMovies();
        //console.log(pageNumber);
        // Sentence will get data from previous page of query in mobile layout
      } else if (e.target.matches(".prev-arrow-mobile")) {
        pageNumber--;
        getMovies();
        //console.log(pageNumber);
      }

      if (e.target.matches(".request")) {
        pageNumber = 1;
        getMovies();
      }
    });
  });

  $inputRequest.addEventListener("keypress", (e) => {
    e.stopImmediatePropagation();
    pageNumber = 1;
    if (e.target.matches("#request")) { if (e.keyCode === 13) getMovies(); }
  });
}
