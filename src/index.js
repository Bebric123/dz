const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Маршрут для получения случайного фильма
app.get('/api/movie/random', async (req, res) => {
    try {
        const response = await axios.get('https://api.kinopoisk.dev/v1.4/movie/random', {
            headers: {
                accept: 'application/json',
                'X-API-KEY': process.env.API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при получении данных с API' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});