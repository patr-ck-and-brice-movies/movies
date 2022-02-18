"use strict";

const url = "https://thunder-outrageous-polka.glitch.me/movies"

function fetchAllMovies() {
    fetch(url)
        .then(res => res.json()
            .then(data => console.log(data)))
        .catch(err => console.log(err));
}
fetchAllMovies();

function fetchOneMovie(id) {
    fetch(`${url}/${id}`)
        .then(res => res.json()
            .then(data => console.log(data)))
        .catch(err => console.log(err));
}

fetchOneMovie(4)