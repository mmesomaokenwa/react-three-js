import express from 'express'
import * as dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config()

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
})

router.route('/').get((req, res) => {
  res.send('Hello from DALL-E')
})

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const response = await openai.post("/images/generations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: {
        // 'model': 'dall-e-2',
        prompt: prompt,
        num_images: 1,
        size: "1024x1024",
        response_format: "b64_json",
        quality: "hd",
      },
    });

    const image = response.data[0].b64_json;

    res.status(200).json({ photo: image })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

export default router