// api/bot.js
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', (ctx) => {
  ctx.reply('Welcome from Vercel! 🌐');
});

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    await bot.handleUpdate(req.body);
    initialized = true;
  } else {
    await bot.handleUpdate(req.body);
  }

  res.status(200).send('ok');
}
