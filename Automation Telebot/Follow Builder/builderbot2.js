let { message } = require("telegraf/filters")
let { Telegraf, Markup } = require("telegraf")
require("dotenv").config()
let bot = new Telegraf(`${process.env.TELEGRAM_BOT_TOKEN}`)

// bot.start(ctx => {
//     ctx.reply("🤖")
// })

bot.start((ctx) => {
    ctx.reply(
        'Choose an option:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Say Hello 👋', 'say_hello')],
            [Markup.button.callback('Show Time 🕒', 'show_time')],
        ])
    );
});


// Action handlers
bot.action('say_hello', (ctx) => {
    ctx.answerCbQuery(); // hide loading animation
    ctx.reply('Hello there! 😄');
    ctx.reply(
        'Choose:',
        Markup.keyboard([
          ['Option 1', 'Option 2','Option 3'],
          ['Option 4']
        ]).resize()
      );
});

bot.hears('Option 1', (ctx) => {
  ctx.reply('You chose Option 1 😁');
  ctx.reply('Now pick more:', Markup.keyboard([
      ['SubOption 1A', 'SubOption 1B'],
      ['Back']
  ]).resize());
});


bot.action('show_time', (ctx) => {
    // ctx.answerCbQuery(); // hide loading animation
    // ctx.reply(new Date().getDate());
    Markup.inlineKeyboard([
        [
          Markup.button.callback('Yes ✅', 'yes'),
          Markup.button.callback('No ❌', 'no')
        ]
      ])
});

bot.launch()