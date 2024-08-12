const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Your app_key, app_secret, username, and password should be securely stored and retrieved, e.g., using environment variables.
const app_key = 'Pc0yKAFRbzf6N3yk9msFYs8Ttc';       // Replace with your actual app_key
const app_secret = 'LNHBzWWQliD4uLxzvSRNHFNFFUrleCTptabBuNIPtA1fDKVEbK0d'; // Replace with your actual app_secret
const username = '01619754538';     // Replace with your actual username
const password = '-2E8SmJ1B{t';     // Replace with your actual password

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
                'username': username, // Username associated with your merchant account
                'password': password  // Password associated with your merchant account
            },
        });

        // If the request is successful, you'll get the access token
        console.log('Access Token:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error getting access token', error: error.response ? error.response.data : error.message });
    }
});

// Create Payment Route
app.post('/create-payment', async (req, res) => {
    const { id_token, payerReference, callbackURL, merchantAssociationInfo, amount, currency, intent, merchantInvoiceNumber } = req.body;

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
            mode: '0011', // Based on your requirements
            payerReference: payerReference,
            callbackURL: callbackURL,
            merchantAssociationInfo: merchantAssociationInfo,
            amount: amount,
            currency: currency,
            intent: intent,
            merchantInvoiceNumber: merchantInvoiceNumber
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + id_token,
                'X-App-Key': app_key
            }
        });

        // If the payment creation is successful, return the response
        console.log('Payment Created:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error creating payment', error: error.response ? error.response.data : error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
