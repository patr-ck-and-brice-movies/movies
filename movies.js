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
    function getGenres(){
        let genreHTML = ''
        let genreString = `${movie.genre}`
        let genreArray = genreString.split(', ')
        for (let i = 0; i < genreArray.length; i++) {
            genreHTML += `<span class="tag">${genreArray[i]}</span>`
        }
        return genreHTML
    }
    return `
<div class="movie-card col-12">

    <div class="container">

        <a href="#"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/hobbit_cover.jpg" alt="cover" class="cover" /></a>

        <div class="hero">

            <div class="details">

                <div class="title1">${movie.title}</div>

                <div class="title2">${movie.year}, ${movie.director}</div>

                <fieldset class="rating">
                    <input type="radio" id="star5" name="rating" value="5" /><label class="full" for="star5" title="Awesome - 5 stars"></label>
                    <input type="radio" id="star4half" name="rating" value="4 and a half" /><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
                    <input type="radio" id="star4" name="rating" value="4" checked /><label class = "full" for="star4" title="Pretty good - 4 stars"></label>
                    <input type="radio" id="star3half" name="rating" value="3 and a half" /><label class="half" for="star3half" title="Meh - 3.5 stars"></label>
                    <input type="radio" id="star3" name="rating" value="3" /><label class = "full" for="star3" title="Meh - 3 stars"></label>
                    <input type="radio" id="star2half" name="rating" value="2 and a half" /><label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>
                    <input type="radio" id="star2" name="rating" value="2" /><label class = "full" for="star2" title="Kinda bad - 2 stars"></label>
                    <input type="radio" id="star1half" name="rating" value="1 and a half" /><label class="half" for="star1half" title="Meh - 1.5 stars"></label>
                    <input type="radio" id="star1" name="rating" value="1" /><label class = "full" for="star1" title="Sucks big time - 1 star"></label>
                    <input type="radio" id="starhalf" name="rating" value="half" /><label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
                </fieldset>

                <span class="ratings">${movie.rating}</span>

            </div> <!-- end details -->

        </div> <!-- end hero -->

        <div class="description">

            <div class="column1" id="genres">
                ${getGenres()}
            </div> <!-- end column1 -->

            <div class="column2">

                <p id="plot">${movie.plot}</p>


            </div> <!-- end column2 -->
        </div> <!-- end description -->


    </div> <!-- end container -->
</div> <!-- end movie-card -->
`
}