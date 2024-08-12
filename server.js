const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/grant-token', async (req, res) => {
    const { app_key, app_secret, username, password } = req.body;

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
            app_key,
            app_secret,
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : error.message);
    }
});

app.post('/create-payment', async (req, res) => {
    const { mode, payerReference, callbackURL, merchantAssociationInfo, amount, currency, intent, merchantInvoiceNumber } = req.body;
    const id_token = req.headers.authorization.split(' ')[1];
    const app_key = req.headers['x-app-key'];

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/payment/create', {
            mode,
            payerReference,
            callbackURL,
            merchantAssociationInfo,
            amount,
            currency,
            intent,
            merchantInvoiceNumber
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${id_token}`,
                'X-App-Key': app_key
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
