const d = document,
  w = window;

export default function responsiveMedia(id, mq, mobile, desktop) {
  let breakpoint = w.matchMedia(mq);

  const responsive = (e) => {
    if (e.matches) {
      // Desktop
      d.querySelector("h2").innerHTML = "Search for a movie or series in the search engine above<br>and move the scroll to the side to choose more movies after search.";
      d.querySelector(".next-arrow").classList.remove("none");
      d.getElementById(id).innerHTML = desktop;
    } else {
      // Mobile
      d.querySelector("h2").innerHTML = "Search for a movie or series in the search engine above in the menu button<br>and keep scrolling to select more info cards after search.";
      d.querySelector(".prev-arrow").classList.add("none");
      d.querySelector(".next-arrow").classList.add("none");
      d.getElementById(id).innerHTML = mobile;
    }
  }

  responsive(breakpoint);
  breakpoint.addListener(responsive);
}