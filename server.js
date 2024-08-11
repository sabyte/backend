const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to get the token from bKash
app.post('/grant-token', async (req, res) => {
    try {
        const { app_key, app_secret, username, password } = req.body;
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
            app_key: app_key,
            app_secret: app_secret,
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to get access token', error: error.response ? error.response.data : error.message });
    }
});

// Endpoint to create payment
app.post('/create-payment', async (req, res) => {
    try {
        const { id_token, mode, payerReference, callbackURL, merchantAssociationInfo, amount, currency, intent, merchantInvoiceNumber } = req.body;
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/payment/create', {
            mode: mode,
            payerReference: payerReference,
            callbackURL: callbackURL,
            merchantAssociationInfo: merchantAssociationInfo,
            amount: amount,
            currency: currency,
            intent: intent,
            merchantInvoiceNumber: merchantInvoiceNumber
        }, {
            headers: {
                'Authorization': `Bearer ${id_token}`,
                'X-App-Key': 'Pc0yKAFRbzf6N3yk9msFYs8Ttc',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to create payment', error: error.response ? error.response.data : error.message });
    }
});

// Endpoint to execute payment
app.post('/execute-payment', async (req, res) => {
    try {
        const { id_token, paymentID } = req.body;
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/payment/execute', {
            paymentID: paymentID
        }, {
            headers: {
                'Authorization': `Bearer ${id_token}`,
                'X-App-Key': 'Pc0yKAFRbzf6N3yk9msFYs8Ttc',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error executing payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to execute payment', error: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
