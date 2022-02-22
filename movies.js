"use strict";

const url = "https://thunder-outrageous-polka.glitch.me/movies"

function fetchAllMovies() {
    fetch(url)
        .then(res => res.json()
            .then(data => {
                console.log(data)
                displayMovies(data)
            }))

        .catch(err => console.log(err));
}


function fetchOneMovie(id) {
    fetch(`${url}/${id}`)
        .then(res => res.json()
            .then(data => console.log(data)))
        .catch(err => console.log(err));
}
// fetchOneMovie(4)

function createMovie(movie) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(movie),
    };
    fetch(`${url}`, options)
        .then(res => {
            console.log('New movie has been saved');
            fetchAllMovies();
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

function deleteMovie(id) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    fetch(`${url}/${id}`, options)
        .then(res => res.json()
            .then(() => console.log(`Movie deleted id: ${id}`)))
        .catch(err => console.log(err));
}

// deleteMovie(14)

function displayMovies(data) {
    let fullMovieData = ''
    for (let movie of data) {
        fullMovieData += getData(movie)
    }
    let moviedata = document.querySelector('#moviedata');
    moviedata.innerHTML = fullMovieData
}

function getData(movie){
    // console.log(`title: ${movie.title}`)
    // console.log(`director: ${movie.director}`)
    // console.log(`genre: ${movie.genre}`)
    // console.log(`year: ${movie.year}`)
    // console.log(`rating: ${movie.rating}`)
    // console.log(`plot: ${movie.plot}`)
    return `<div>${movie.director}</div>`
}