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

getMovieBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/api/movie/random')
        .then(response => response.json())
        .then(response => {
            currentMovie = {
                name: response.name || response.alternativeName,
                poster: response.poster?.previewUrl || defaultPoster
            };
            movieDiv.innerHTML = `
                <img src="${currentMovie.poster}" alt="${currentMovie.name}" style="width:200px;"/>
                <h2>${currentMovie.name}</h2>
            `;
        })
        .catch(err => console.error('Ошибка получения фильма:', err));
});

addFavoriteBtn.addEventListener('click', () => {
    if (currentMovie) {  
        let favorites = JSON.parse(getCookie('favorites') || '[]');
        favorites.push(currentMovie);
        document.cookie = `favorites=${JSON.stringify(favorites)}; path=/; max-age=31536000`;
        alert('Фильм добавлен в избранное!');
    }
});

getRandomFavoriteBtn.addEventListener('click', () => {
    let favorites = JSON.parse(getCookie('favorites') || '[]');

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
});
function displayFavorites() {
    let favorites = JSON.parse(getCookie('favorites') || '[]');
    favoritesListDiv.innerHTML = favorites.map(movie => `
        <div>
            <img src="${movie.poster || defaultPoster}" alt="${movie.name}" style="width:100px;"/>
            <p>${movie.name}</p>
        </div>
    `).join('');
}

function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
displayFavorites();