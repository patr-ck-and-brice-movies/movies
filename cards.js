"use strict";


const url = "https://thunder-outrageous-polka.glitch.me/movies"



function fetchAllMovies() {
    $(window).on("load",function(){
        $(".loader-wrapper").fadeOut("slow");
    });
    fetch(url)
        .then(res => res.json()
            .then(data => {
                displayMovies(data)
            }))

        .catch(err => console.log(err));
}

fetchAllMovies()
$('#homebutton').click(function() {
    location.reload()
    });


function fetchOneMovie(id) {
    fetch(`${url}/${id}`)
        .then(res => res.json()
            .then(data => {
                displayMovies(data)
            }))
        .catch(err => console.log(err));
}


let movieSearchBox = $('#moviesearch2');
let movieSearchBTN = $('#moviesearch2button');
function searchMovies(){
    console.log(movieTitles)
    let searchVal = movieSearchBox.val()
    for (let i = 0; i < movieTitles.length; i++) {
        console.log(searchVal)
        console.log(movieTitles[i].id)
        if(searchVal.toLowerCase() === movieTitles[i].title.toLowerCase()) {
            fetchOneMovie(movieTitles[i].id)
            break
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
    fetch(`${url}/${id}`)
        .then(res => res.json()
            .then(data => {
                let movieUpdate = {
                    title: data.title,
                    director: data.director,
                    actors: data.actors,
                    genre: data.genre,
                    year: data.year,
                    rating: data.rating,
                    plot: data.plot,
                    poster: data.poster,
                    imDbID: data.imDbID,
                    trailerURL: data.trailerURL,
                    runtime: data.runtime,
                    MPAA: data.MPAA,
                    favorite: data.favorite
                }
                movieUpdate.favorite = movieUpdate.favorite === false;
                console.log(movieUpdate)
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
                        fetchAllMovies()
                    })
                    .catch(err => console.log(err));
            }))
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
    movieTitles = []
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
let movieID = 0;
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
    MPAA: "",
    favorite: false
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
                movie.rating = data.imDbRating;
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
                movie.favorite = false
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
        id: parseInt(movie.id)
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
<div class="movie-card col-xs-12 col-md-6 col-xl-4 mb-5 pb-5" id="movie-${movie.id}">
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
          <h6>IMDb Rating: ${movie.rating} out of 10</h6>
          <h5>SUMMARY</h5>
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
        <div><i class="fa fa-heart ${movie.favorite}" onclick="updateMovie(${movie.id})"></i></div> 
      </div>
    </div>
  </div>
</div>
</div> <!-- end movie-card -->
`
}









