const express = require("express");
const app = express();

const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

console.log("🚀 Iniciando bot...");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🌐 Servidor (Render precisa disso)
app.get("/", (req, res) => {
  res.send("Bot online 🤖");
});

app.listen(3000, () => {
  console.log("🌐 Servidor rodando na porta 3000");
});

// 🤖 Quando o bot logar no Discord
client.once("ready", () => {
  console.log(`🤖 LOGADO COMO: ${client.user.tag}`);
});

// 💬 Mensagens no Discord
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    const prompt = message.content
      .replace(`<@${client.user.id}>`, "")
      .trim();

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
      console.log("❌ ERRO NA IA:", err.response?.data || err.message);
      message.reply("Erro na IA ❌");
    }
  }
});

// 🔑 LOGIN DO BOT (COM DEBUG)
console.log("🔑 Tentando logar no Discord...");

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log("✅ Login enviado com sucesso");
  })
  .catch((err) => {
    console.log("❌ ERRO NO LOGIN DO DISCORD:");
    console.log(err);
  });
