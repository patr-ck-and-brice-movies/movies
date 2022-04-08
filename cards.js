"use strict";


const url = "http://localhost:8081/movies"

function fetchAllMovies() {
    $(window).on("load",function(){
        $(".loader-wrapper").fadeOut("slow");
    });
    fetch(url)
        .then(res => res.json()
            .then(data => {
                data.sort((a,b)=> (a.title > b.title ? 1 : -1))
                displayMovies(data)
            }))

        .catch(err => console.log(err));
}
fetchAllMovies()

// listeners for reload
$('#homebutton').click(function() {
    location.reload()
});
$('.jumbotron').click(function() {
    location.reload()
});

// search movies function

let movieSearchBox = $('#moviesearch2');
let movieSearchBTN = $('#moviesearch2button');
function searchMovies(){
    let searchVal = movieSearchBox.val()
    for (let i = 0; i < movieTitles.length; i++) {
        console.log(searchVal)
        console.log(movieTitles[i].id)
        if(searchVal.toLowerCase() === movieTitles[i].title.toLowerCase()) {
            displayMovies(movieTitles[i])
            break
        }
    }
}
movieSearchBTN.on('click', searchMovies)
// filter favorites function
let filterFavoritesBTN = $('#favorites-button');
let filteredFavorites = []
let status = "norm"
function filterMovies(){
if(status === "norm") {
    for (let i = 0; i < movieTitles.length; i++) {
        if (movieTitles[i].favorite === true) {
            filteredFavorites.push(movieTitles[i])
        }
    }
    displayMovies(filteredFavorites)
    status = "favs"
} else {
    window.location.reload();
}

}
filterFavoritesBTN.on('click', filterMovies)
filterFavoritesBTN.dblclick(function (){
    location.reload()
})
// sort by Rating
let sortRatingBTN = $('#sortRating-button');
function ratingSort(){
    movieTitles.sort((a,b)=> (a.rating > b.rating ? -1 : 1))
    displayMovies(movieTitles)
}
sortRatingBTN.on('click', ratingSort)


// create a new movie function
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


// update a movie function
function updateMovie(id) {
    let movieUpdate;
    for (let i = 0; i < movieTitles.length; i++) {
        if(movieTitles[i].id === id) {
            movieUpdate = movieTitles[i]
        }
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
                    .then(res =>
                        fetchAllMovies())
                    .catch(err => console.log(err));
}

// delete a movie function
function deleteMovie(id) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: id
    }
    fetch(`${url}/${id}`, options)
        .then(res =>
            fetchAllMovies())
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

// initiate variables
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
//listener for search box
$("#addmovie").click(function (){
    searchThis = $('#moviesearch').val()
    searchIMDB()
})


// get movie ID from  IMDb
function searchIMDB(){
    fetch(`https://imdb-api.com/en/API/SearchMovie/${IMDb_TOKEN}/${searchThis}`)
        .then(res => res.json()
            .then(data => {
                movieID = data.results[0].id
                getMovieDetails()
            }))

        .catch(err => console.log(err));
}
// get movie information from ID
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
// get trailer from IMDb
function getTrailer(){
    return fetch(`https://imdb-api.com/en/API/YouTubeTrailer/${IMDb_TOKEN}/${movieID}`)
        .then(res => res.json()
            .then(data => {
                movieTrailer = data.videoUrl;
                return movieTrailer
            }))
        .catch(err => console.log(err));
}

// creates movie cards
let movieTitles = []
function getData(movie){
    movieTitles.push({
        id: parseInt(movie.id),
        title: movie.title,
        director: movie.director,
        actors: movie.actors,
        genre: movie.genre,
        year: movie.year,
        rating: movie.rating,
        plot: movie.plot,
        poster: movie.poster,
        imDbID: movie.imDbID,
        trailerURL: movie.trailerURL,
        runtime: movie.runtime,
        MPAA: movie.MPAA,
        favorite: movie.favorite
    })
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

//toggles expanded plot box
function toggling(p) {
    let className = p.getAttribute("class");
    if(className==="movie-description") {
        p.className = "full-movie-description";
    } else {
        p.className = "movie-description";
    }

}
