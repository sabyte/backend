const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Root Route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Grant Token Route
app.post('/grant-token', async (req, res) => {
    const { app_key, app_secret, username, password } = req.body;

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
            app_key,
            app_secret
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'username': username,
                'password': password
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error getting access token', error: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
