import express from 'express';
import axios from 'axios';
import 'dotenv/config';
import cors from 'cors';

const app = express();

app.use(cors()); 
app.use(express.json());

/**
 * Route to forward requests to the API.
 * It mirrors the request body and headers, adding the necessary API key.
 */
app.post('/ai-api', async (req, res) => {
    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY || '',
                },
            }
        );
        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error('Error forwarding to Generative Language API:', error.response?.data || error.message);
        res.status(error.response?.status || 500).send(error.response?.data || 'An error occurred');
    }
});

const PORT = process.env.FORWARDER_PORT || 8000;
app.listen(PORT, () => {
    console.log(`Forwarder server listening on port ${PORT}`);
});