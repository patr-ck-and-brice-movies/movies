"use strict";


const url = "https://thunder-outrageous-polka.glitch.me/movies"

$(window).on("load",function(){
    $(".loader-wrapper").fadeOut("slow");
});

function fetchAllMovies() {
    fetch(url)
        .then(res => res.json()
            .then(data => {
                displayMovies(data)
            }))

        .catch(err => console.log(err));
}

fetchAllMovies()


function fetchOneMovie(id) {
    fetch(`${url}/${id}`)
        .then(res => res.json()
            .then(data => {
                displayMovies(data)
            }))
        .catch(err => console.log(err));
}
// fetchOneMovie(288)

let movieSearchBox = $('#moviesearch2');
let movieSearchBTN = $('#moviesearch2button');
function searchMovies(){
    let searchVal = movieSearchBox.val()
    for (let i = 0; i < movieTitles.length; i++) {
        if(searchVal === movieTitles[i].title) {
            fetchOneMovie(movieTitles[i].id)
            break
        } else {
            fetchAllMovies()
        }
    }
}
movieSearchBTN.on('click', searchMovies)

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


function deleteMovie(id) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    fetch(`${url}/${id}`, options)
        .then(res => res.json()
            .then(() => fetchAllMovies()))
        .catch(err => console.log(err));
}


function displayMovies(data) {
    let fullMovieData = ''
    if (data.length > 1) {
        for (let movie of data) {
            fullMovieData += getData(movie)
        }
    } else {
        fullMovieData = getData(data)
    }
    let moviedata = document.querySelector('#moviedata');
    moviedata.innerHTML = fullMovieData
}


let searchThis = "";
let movieID = "";
let movieTrailer = "";
let movie = {
    title: "",
    director: "",
    actors: "",
    genre: "",
    year: "",
    rating: "",
    plot: "",
    poster: "",
    imDbID: "",
    trailerURL: "",
    runtime: "",
    MPAA: ""
}

$("#addmovie").click(function (){
    searchThis = $('#moviesearch').val()
    searchIMDB()
})

function searchIMDB(){
    fetch(`https://imdb-api.com/en/API/SearchMovie/${IMDb_TOKEN}/${searchThis}`)
        .then(res => res.json()
            .then(data => {
                movieID = data.results[0].id
                getMovieDetails()
            }))

        .catch(err => console.log(err));
}

function getMovieDetails(){
    fetch(`https://imdb-api.com/en/API/Title/${IMDb_TOKEN}/${movieID}`)
        .then(res => res.json()
            .then(data => {
                movie.title = data.title;
                movie.director = data.directors;
                movie.actors = data.stars;
                movie.genre = data.genres;
                movie.year = data.year;
                movie.rating = parseInt(data.imDbRating)/2;
                movie.plot = data.plot;
                movie.poster = data.image;
                movie.imDbID = data.id;
                movie.runtime = data.runtimeStr;
                movie.MPAA = data.contentRating;
                getTrailer().then(r => {
                    movie.trailerURL = r
                    console.log(movie)
                    createMovie(movie)
                })
            }))
        .catch(err => console.log(err));
}

function getTrailer(){
    return fetch(`https://imdb-api.com/en/API/YouTubeTrailer/${IMDb_TOKEN}/${movieID}`)
        .then(res => res.json()
            .then(data => {
                movieTrailer = data.videoUrl;
                return movieTrailer
            }))
        .catch(err => console.log(err));
}

let movieTitles = []
function getData(movie){
    movieTitles.push({
        title: movie.title,
        id: movie.id
    })
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
<div class="movie-card col-xs-12 col-md-6 col-xl-4" id="${movie.id}">
  <div class="cellphone-container">
    <div class="movie">
      <div class="menu" onclick="deleteMovie(${movie.id})"><i class="material-icons delete-icon">delete</i></div>
      <div class="movie-img" style="background-image: url(${movie.poster})"></div>
      <div class="text-movie-cont">
        <div class="mr-grid">
          <div class="col1">
            <h1 class="title">${movie.title}</h1>
            <ul class="movie-gen">
              <li>${movie.MPAA} \/</li>
              <li>${movie.runtime} \/</li>
              <li>${movie.genre}</li>
            </ul>
          </div>
        </div>
        <div class="mr-grid summary-row">
          <div class="col2">
            <h5>SUMMARY</h5>
          </div>
          <div class="col2">
            <fieldset class="rating" id="rating-${movie.id}">
              <input type="radio" id="star5" name="rating-${movie.rating}" value="5" checked/><label class="full" for="star5" title="Awesome - 5 stars"></label>
              <input type="radio" id="star4half" name="rating-${movie.rating}" value="4 and a half" /><label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>
              <input type="radio" id="star4" name="rating-${movie.rating}" value="4"/><label class = "full" for="star4" title="Pretty good - 4 stars"></label>
              <input type="radio" id="star3half" name="rating-${movie.rating}" value="3 and a half" /><label class="half" for="star3half" title="Meh - 3.5 stars"></label>
              <input type="radio" id="star3" name="rating-${movie.rating}" value="3"/><label class = "full" for="star3" title="Meh - 3 stars"></label>
              <input type="radio" id="star2half" name="rating-${movie.rating}" value="2 and a half" /><label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>
              <input type="radio" id="star2" name="rating-${movie.rating}" value="2"/><label class = "full" for="star2" title="Kinda bad - 2 stars"></label>
              <input type="radio" id="star1half" name="rating-${movie.rating}" value="1 and a half" /><label class="half" for="star1half" title="Meh - 1.5 stars"></label>
              <input type="radio" id="star1" name="rating-${movie.rating}" value="1"/><label class = "full" for="star1" title="Sucks big time - 1 star"></label>
              <input type="radio" id="starhalf" name="rating-${movie.rating}" value="half" /><label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
            </fieldset>
          </div>
        </div>
        <div class="mr-grid">
          <div class="col1">
            <p class="movie-description" onclick="toggling(this)">${movie.plot}</p>
          </div>
        </div>
        <div class="mr-grid actors-row">
          <div class="col1">
            <p class="movie-actors">Starring: ${movie.actors}</p>
            <p class="movie-actors">Director: ${movie.director}</p>
          </div>
        </div>
        <div class="mr-grid action-row">
          <div class="col2"><div class="watch-btn"><a href="${movie.trailerURL}" onclick="return !window.open(this.href, 'YouTube', 'width=600, height=400')"><h3><i class="material-icons playsymb">&#xE037;</i>WATCH TRAILER</h3></a></div>
        </div>
      </div>
    </div>
  </div>
</div>
</div> <!-- end movie-card -->
`
}

function toggling(p) {
    var className = p.getAttribute("class");
    if(className==="movie-description") {
        p.className = "full-movie-description";
    }
    else{
        p.className = "movie-description";
    }
}

