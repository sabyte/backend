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
            app_key: 'Pc0yKAFRbzf6N3yk9msFYs8Ttc',
            app_secret: 'LNHBzWWQliD4uLzxvSRNHFNFFUrIeCTptabBuNIPtAIfDKVEbK0c'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'username': 'username',
                'password': 'password'
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error getting access token', error: error.response ? error.response.data : error.message });
    }
});

// Create Payment Route
app.post('/create-payment', async (req, res) => {
    const { id_token } = req.body;

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
            mode: '0011',
            payerReference: '01723888888',
            callbackURL: 'https://vending-user-interface-frontend.onrender.com',
            merchantAssociationInfo: 'MI05MID54RF09123456One',
            amount: '500',
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: 'Inv0124'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${id_token}`,
                'X-App-Key': 'Pc0yKAFRbzf6N3yk9msFYs8Ttc'
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error creating payment', error: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
