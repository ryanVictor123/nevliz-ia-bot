const express = require("express");
const app = express();

const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🌐 servidor pra Render não dormir
app.get("/", (req, res) => {
  res.send("Bot online 🤖");
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});

// 🤖 bot pronto
client.once("ready", () => {
  console.log(`Logado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    const prompt = message.content.replace(`<@${client.user.id}>`, "").trim();

    if (!prompt) return message.reply("Fala algo 😎");

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é uma IA especialista em Roblox Studio e Lua scripting. Ajude com scripts, explicações e criação de sistemas no Roblox de forma clara e prática.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      message.reply(res.data.choices[0].message.content);
    } catch (err) {
      console.log(err);
      message.reply("Erro na IA ❌");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
