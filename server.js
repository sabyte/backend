const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Grant Token Route
app.post('/grant-token', async (req, res) => {
    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
            app_key: 'Pc0yKAFRbzf6N3yk9msFYs8Ttc',
            app_secret: 'LNHBzWWQliD4uLzxvSRNHFNFFUrleCTptabBuNIPtAIfDKVEbK0c'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'username': '01619754538',
                'password': '-2E8SmJIB{t'
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
