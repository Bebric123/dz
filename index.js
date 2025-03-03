const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); 



const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

        if (error.response) {
            // Ошибка от API (4xx или 5xx)
            const { status, data } = error.response;

            if (status >= 400 && status < 500) {
                return res.status(status).json({ 
                    message: 'Ошибка клиента при запросе к API', 
                    status,
                    details: data 
                });
            }

            if (status >= 500 && status < 600) {
                return res.status(status).json({ 
                    message: 'Ошибка на стороне API', 
                    status,
                    details: data 
                });
            }

            return res.status(status).json({ 
                message: 'Неизвестная ошибка от API', 
                status,
                details: data 
            });
        } else if (error.request) {
            // Ошибка запроса (например, API недоступно)
            return res.status(503).json({ 
                message: 'Сервис API недоступен', 
                status: 503 
            });
        } else {
            // Другая ошибка (например, ошибка в коде)
            return res.status(500).json({ 
                message: 'Внутренняя ошибка сервера', 
                status: 500 
            });
        }
    }
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});