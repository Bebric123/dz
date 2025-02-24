const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'X-API-KEY': 'W6SQB49-2YHM32Q-MQ23QK9-695J79E'}
};

const movieDiv = document.getElementById('movie');
const favoriteDiv = document.getElementById('favoriteMovie');
const favoritesListDiv = document.getElementById('favoritesList');
const getMovieBtn = document.getElementById('getMovieBtn');
const addFavoriteBtn = document.getElementById('addFavoriteBtn');
const getRandomFavoriteBtn = document.getElementById('getRandomFavoriteBtn');

const defaultPoster = 'https://avatars.mds.yandex.net/i?id=138b479b8014f3d76a43b6ec36dfb04f2bc87f28-9072244-images-thumbs&n=13';

let currentMovie = null;

getMovieBtn.addEventListener('click', fetchRandomMovie);
addFavoriteBtn.addEventListener('click', addMovieToFavorites);
getRandomFavoriteBtn.addEventListener('click', displayRandomFavorite);

function fetchRandomMovie() {
    fetch('http://localhost:3000/api/movie/random')
        .then(response => response.json())
        .then(movie => displayMovie(movie))
        .catch(err => console.error('Ошибка получения фильма:', err));
}

function displayMovie(movie) {
    currentMovie = {
        name: movie.name || movie.alternativeName,
        poster: movie.poster?.previewUrl || defaultPoster
    };

    movieDiv.innerHTML = `
        <img src="${currentMovie.poster}" alt="${currentMovie.name}" style="width:200px;"/>
        <h2>${currentMovie.name}</h2>
    `;
}

function addMovieToFavorites() {
    if (currentMovie) {
        const favorites = getFavorites();
        favorites.push(currentMovie);
        saveFavorites(favorites);
        alert('Фильм добавлен в избранное!');
        displayFavorites(); 
    }
}

function displayRandomFavorite() {
    const favorites = getFavorites();

    if (favorites.length > 0) {
        const randomMovie = favorites[Math.floor(Math.random() * favorites.length)];
        favoriteDiv.innerHTML = `
            <h2>Случайный избранный фильм</h2>
            <img src="${randomMovie.poster || defaultPoster}" alt="${randomMovie.name}" style="width:200px;"/>
            <h2>${randomMovie.name}</h2>
        `;
    } else {
        favoriteDiv.innerHTML = '<p>Избранных фильмов нет.</p>';
    }
}

function displayFavorites() {
    const favorites = getFavorites();

    favoritesListDiv.innerHTML = favorites.map(movie => `
        <div>
            <img src="${movie.poster || defaultPoster}" alt="${movie.name}" style="width:100px;"/>
            <p>${movie.name}</p>
        </div>
    `).join('');
}

function getFavorites() {
    return JSON.parse(getCookie('favorites') || '[]');
}

function saveFavorites(favorites) {
    document.cookie = `favorites=${JSON.stringify(favorites)}; path=/; max-age=31536000`;
}

function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

displayFavorites();