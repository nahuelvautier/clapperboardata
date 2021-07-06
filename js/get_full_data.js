import OMDBKEY from "./omdb_keys.js";

const d = document,
  w = window;

export default function getAllData() {
  const $fullShowNot = d.getElementById("full-not"),
    $fullLoader = d.querySelector(".full-loader"),
    $articleInfo = d.getElementById("article-full-info"),
    $templateInfo = d.getElementById("template-full-info").content,
    $fragmentInfo = d.createDocumentFragment();


  d.addEventListener("click", async (e) => {
    //console.log(e.target);
    if (e.target.matches(".imdb-query")) {
      $articleInfo.innerHTML = "";

      let getQueryID = e.target.name;

      try {
        $fullLoader.classList.remove("none");
        $articleInfo.innerHTML = "";
        $fullShowNot.classList.add("none"); 

        let apiAllData = `https://www.omdbapi.com/?i=${getQueryID}&plot=short&apikey=${OMDBKEY.key}`,
          resAllData = await fetch(apiAllData),
          jsonAllData = await resAllData.json();
        
        if (!resAllData.ok) throw { status: res.status, statusText: res.statusText };
        //console.log(jsonAllData);

        if (jsonAllData.response === "False") {
          $fullShowNot.classList.remove("none");
          $fullLoader.classList.add("none");
          $articleInfo.classList.add("none");

          $fullShowNot.innerHTML = `<h3 style="color=#f00; padding: 5rem">An error has ocurred trying to query</h3>`;
        } else {
          $fullLoader.classList.add("none");
          $fullShowNot.classList.add("none");
          $articleInfo.classList.remove("none");

          $templateInfo.querySelector("h3").textContent = jsonAllData.Title;

          $templateInfo.querySelector("figure").classList.add("img-item");
          $templateInfo.querySelector("img").src = !(jsonAllData.Poster === "N/A" ) ? jsonAllData.Poster : ($templateInfo.querySelector("img").src = "assets/pic-not-found.svg");
          $templateInfo.querySelector("img").alt = jsonAllData.Title;
          $templateInfo.querySelector("figcaption").textContent =jsonAllData.Title;
          $templateInfo.querySelector(".plot").textContent = !(jsonAllData.Plot === "N/A") ? `Plot: ${jsonAllData.Plot}` : ($templateInfo.querySelector(".plot").textContent = "");
          $templateInfo.querySelector(".year").textContent = `Year: ${jsonAllData.Year}`;
          $templateInfo.querySelector(".rated").textContent = `Rate: ${jsonAllData.imdbRating}`;
          $templateInfo.querySelector(".director").textContent = `Director: ${jsonAllData.Director}`;
          $templateInfo.querySelector(".writer").textContent = `Writer: ${jsonAllData.Writer}`;
          $templateInfo.querySelector(".actors").textContent = `Actors: ${jsonAllData.Actors}`;

          $templateInfo.querySelector(".runtime").textContent = `Runtime: ${jsonAllData.Runtime}`;
          $templateInfo.querySelector(".type").textContent =`TYPE: ${jsonAllData.Type}`.toUpperCase();
          $templateInfo.querySelector(".genre").textContent = `Genre(s): ${jsonAllData.Genre}`;
          $templateInfo.querySelector(".countries").textContent = `Countries: ${jsonAllData.Country}`;
          $templateInfo.querySelector(".produced").textContent =jsonAllData.Production === undefined ? "Produced by: N/A" :`Produced by: ${jsonAllData.Production}`;
          $templateInfo.querySelector(".imdb").href = `https://www.imdb.com/title/${jsonAllData.imdbID}/?ref_=fn_al_tt_1`;

          let $cloneInfo = d.importNode($templateInfo, true);
          $fragmentInfo.appendChild($cloneInfo);

          $articleInfo.innerHTML = "";
          $articleInfo.appendChild($fragmentInfo);
          w.scrollTo({ behavior: "smooth", top: 2200, });
        }
      } catch (err) {
        console.error(err);
        let message2 = err.statusText || "Undefined error";
        $fullShowNot.innerHTML = "";
        $fullShowNot.innerHTML = `<h3 style="color=#f00; padding: 5rem">Error ${err.status}: ${message2}</h3>`;
      }
    }
  });
}
