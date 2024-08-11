const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post('/grant-token', async (req, res) => {
    try {
        const { app_key, app_secret, username, password } = req.body;
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
        console.error('Error getting access token:', error);
        res.status(500).send('Error getting access token');
    }
});

app.post('/create-payment', async (req, res) => {
    try {
        const { id_token, app_key } = req.headers;
        const paymentData = req.body;

        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/payment/create', paymentData, {
            headers: {
                'Authorization': `Bearer ${id_token}`,
                'X-App-Key': app_key,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).send('Error creating payment');
    }
});

app.post('/execute-payment', async (req, res) => {
    try {
        const { id_token, app_key } = req.headers;
        const paymentID = req.body.paymentID;

        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/payment/execute', {
            paymentID
        }, {
            headers: {
                'Authorization': `Bearer ${id_token}`,
                'X-App-Key': app_key,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error executing payment:', error);
        res.status(500).send('Error executing payment');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
