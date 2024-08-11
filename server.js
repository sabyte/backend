const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Replace these with your actual bKash credentials
const username = '01619754538';
const password = '-2E8SmJIB{t';
const app_key = 'Pc0yKAFRbzf6N3yk9msFYs8Ttc';
const app_secret = 'LNHBzWWQIidD4uLzxvSRNHFNFFUrIeCTptabBuNIPtAIfDKVEbK0c';

// Grant Token Endpoint
app.post('/grant-token', async (req, res) => {
    try {
        const response = await axios.post(
            'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant',
            {
                app_key: app_key,
                app_secret: app_secret,
                username: username,
                password: password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error granting token:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to grant token' });
    }
});

// Create Payment Endpoint
app.post('/create-payment', async (req, res) => {
    const { id_token } = req.body;

    try {
        const response = await axios.post(
            'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create',
            {
                mode: '0011',
                payerReference: '01723888888', // Replace with actual payer reference
                callbackURL: 'https://yourdomain.com/callback', // Replace with your callback URL
                merchantAssociationInfo: 'MI05MID54RF091234560ne', // Replace with actual info
                amount: '500', // Replace with actual amount
                currency: 'BDT',
                intent: 'sale', // Change to 'authorization' if required
                merchantInvoiceNumber: 'Inv0124', // Replace with actual invoice number
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${id_token}`,
                    'X-APP-Key': app_key,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to create payment' });
    }
});

// Execute Payment Endpoint
app.post('/execute-payment', async (req, res) => {
    const { id_token, paymentID } = req.body;

    try {
        const response = await axios.post(
            'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute',
            { paymentID },
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${id_token}`,
                    'X-APP-Key': app_key,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error executing payment:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to execute payment' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
