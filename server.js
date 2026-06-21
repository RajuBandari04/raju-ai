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
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
];
app.post("/chat", async (req, res) => {
  try {

   const messages = req.body.messages || [];

    const prompt = `
You are Raju AI.

You are talking to a Telugu friend.

STRICT RULES:

- Look only at the user's latest message.
- Reply in the same language as the user's latest message.
- If the latest message is English, reply only in English.
- If the latest message is Telugu written in English letters, reply only in Telugu written in English letters.
- Change language immediately when the user changes language.
- Never mix English and Telugu in the same reply.
- Never use Telugu script.
- Keep replies casual like a friend.
- Maximum 2-3 lines.

Examples:

User: hi
Assistant: Hi , how are you?

User: helo
Assistant: Helo , how are you?

User: macha ela unnav
Assistant: Bagunnanu ra, nuvvu ela unnav?

User: what are you doing
Assistant: Just chatting with you bro.

User: em chesthunav
Assistant: Neetho matladuthunna ra.

Conversation:

${messages
  .map(msg => `${msg.role}: ${msg.text}`)
  .join("\n")}
`;

   let response;

for (const key of API_KEYS) {

  try {

    const ai = new GoogleGenAI({
      apiKey: key
    });

    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    break;

  } catch (err) {

    console.log("API failed, trying next...");

  }

}

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



