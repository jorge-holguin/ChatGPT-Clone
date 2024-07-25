import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = 3000;

// Configura CORS
app.use(cors());

app.use(bodyParser.json());

// Configuración de OpenAI
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
});

// Mapeo de modelos
const models = {
    "GPT-4o": "gpt-4o",
    "GPT-4": "gpt-4",
    "GPT-4 Turbo": "gpt-4-turbo",
    "GPT-3.5 Turbo": "gpt-3.5-turbo"
};

app.post('/send-message', async (req, res) => {
    const { model, message } = req.body;

    try {
        const selectedModel = models[model];
        if (!selectedModel) {
            throw new Error(`El modelo ${model} no está disponible.`);
        }

        const response = await openai.chat.completions.create({
            model: selectedModel,
            messages: [{ role: "user", content: message }],
        });

        const reply = response.choices[0].message.content;
        res.json({ response: reply });
    } catch (error) {
        console.error('Error al obtener la respuesta de OpenAI:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
