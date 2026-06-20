const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
app.post("/chat", async (req, res) => {
  try {

   const messages = req.body.messages || [];

    const prompt = `
You are Raju AI.

You are talking to a Telugu friend.

STRICT RULES:
- Reply only in Roman Telugu (English letters).
- Example: "Nenu bagunnanu macha", "Nuvvu ela unnav?"
- Never use Telugu script.
- Never use Hindi.
- Never give translations.
- Never use brackets ().
- Keep replies casual like a friend.
- Maximum 2-3 lines.

Conversation:

${messages
  .map(msg => `${msg.role}: ${msg.text}`)
  .join("\n")}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    res.json({
      reply: response.text
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      reply: "Server Error 😥"
    });
  }
});

app.listen(3000, () => {
  console.log("Raju AI Backend Running 🚀");
});

setInterval(() => {}, 1000);



