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
    const { app_key, app_secret, username, password } = req.body;

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
            app_key: app_key,
            app_secret: app_secret
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'username': '01619754538',
                'password': '-2E8SmJ1B{t'
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
    const { id_token, app_key, payerReference, callbackURL, merchantAssociationInfo, amount, currency, intent, merchantInvoiceNumber } = req.body;

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
            mode: '0011', // Hardcoded based on your requirements
            payerReference: ".",
            callbackURL: "http://localhost:10000",
            merchantAssociationInfo: "MI05MID54RF09123456One",
            amount: "5",
            currency: "BDT",
            intent: "authorization",
            merchantInvoiceNumber: "Inv0124"

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + id_token,
                'X-App-Key': 'Pc0yKAFRbzf6N3yk9msFYs8Ttc'
            }
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
