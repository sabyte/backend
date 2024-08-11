const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Using Axios for HTTP requests

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let paymentID;

// Endpoint to get access token
app.post('/get-token', async (req, res) => {
    const data = {
        username: '01619754538', // Your live username
        password: '-2E8SmJ1B{t', // Your live password
    };

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', data, {
            headers: {
                'Content-Type': 'application/json',
                'X-App-Key': 'Pc0yKAFRbzf6N3yk9msFYs8Ttc', // Your live App Key
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error getting access token:', error.response.data);
        res.status(500).json({ message: 'Error getting access token', error: error.response.data });
    }
});

// Endpoint to create a payment
app.post('/create-payment', async (req, res) => {
    const { amount, intent, currency, invoiceNumber } = req.body;
    const accessToken = req.headers.authorization.split(' ')[1]; // Assuming you're sending Bearer token in headers

    const data = {
        amount: amount || '500',
        currency: currency || 'BDT',
        intent: intent || 'sale',
        merchantInvoiceNumber: invoiceNumber || 'Inv0124',
    };

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create', data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-App-Key': 'Pc0yKAFRbzf6N3yk9msFYs8Ttc', // Your live App Key
            },
        });

        paymentID = response.data.paymentID;
        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error.response.data);
        res.status(500).json({ message: 'Error creating payment', error: error.response.data });
    }
});

// Endpoint to execute a payment
app.post('/execute-payment', async (req, res) => {
    const { paymentID } = req.body;
    const accessToken = req.headers.authorization.split(' ')[1]; // Assuming you're sending Bearer token in headers

    try {
        const response = await axios.post('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute', { paymentID }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-App-Key': 'Pc0yKAFRbzf6N3yk9msFYs8Ttc', // Your live App Key
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error executing payment:', error.response.data);
        res.status(500).json({ message: 'Error executing payment', error: error.response.data });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
