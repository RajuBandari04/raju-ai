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
- Reply in the same language used by the user.
- If user speaks English, reply in English.
- If user speaks Telugu using English letters, reply in Telugu using English letters.
- Never use Telugu script.
- Never use Hindi unless the user asks for Hindi.
- Never give translations.
- Keep replies casual like a friend.
- Maximum 2-3 lines.

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



