import express from 'express'
import ejs from 'ejs'
import dotenv from "dotenv";
import {Groq} from "groq-sdk";

dotenv.config();

const app = express();

app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(express.static('public')) //tells express.js to use HTML, use the public
app.set('view engine', 'ejs')     //tells express to set view-engine to ejs

app.get('/', function (req,res) {
  res.render('pages/index') 
})

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices?.[0]?.message?.content || "";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(3000, () => {
  console.log("Server running...");
})