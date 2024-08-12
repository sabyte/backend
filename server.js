const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Sensitive information
const username = '01619754538';
const password = '-2E8SmJIB{t';
const app_key = 'Pc0yKAFRbzf6N3yk9msFYs8Ttc';
const app_secret = 'LNHBzWWQliD4uLxzvSRNHFNFFUrIeCTptabBuNIPtAIfDKVEbK0c';

// Grant Token Route
app.post('/grant-token', async (req, res) => {
    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
            app_key: app_key,
            app_secret: app_secret
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

// Root route to confirm the server is running
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
