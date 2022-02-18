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
// fetchOneMovie(4)

function createMovie() {
    const newMovie = {
        title: "placeholder",
        director: "placeholder",
        actors: "placeholder",
        genre: "placeholder",
        year: "placeholder",
        rating: "placeholder",
        plot: "placeholder",
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(newMovie),
    };
    fetch(`${url}`, options)
        .then(res => {
            console.log('New movie has been saved');
        })
        .catch(err => console.log(err));
}

// createMovie()

function updateMovie(id) {
    const movieUpdate = {
        title: 'new title',
        actors: 'better actors',
    }
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(movieUpdate),
    };
    fetch(`${url}/${id}`, options)
        .then(res => {
            console.log(`Movie ${id} has been updated`)
        })
        .catch(err => console.log(err));
}
// updateMovie(4)

