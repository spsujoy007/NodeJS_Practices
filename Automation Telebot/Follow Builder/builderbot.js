// let { message } = require("telegraf/filters")
// let { Telegraf } = require("telegraf")
// require("dotenv").config()
// let bot = new Telegraf(`${process.env.TELEGRAM_BOT_TOKEN}`)

// bot.start(ctx => {
//     ctx.reply("🤖")
// })
// // bot.on(message('sticker', (ctx) => ctx.reply("🌸") ))
// bot.on(message('text'), async (ctx) => {
//     const {first_name, last_name, username} = ctx.from
//     const operator = ctx.message.text.match(/[+\-*/]/)[0]; // Find the operator
//     const [num1, num2] = ctx.message.text.split(/[+\-*/]/).map(Number); // Split and convert to numbers

//     switch (operator){
//         case "+":
//             ctx.reply(`= ${num1 + num2}`)
//             break
//         case "-":
//             ctx.reply(`= ${num1 - num2}`)
//             break
//         case "*":
//             ctx.reply(`= ${num1 * num2}`)
//             break
//         case "/":
//             ctx.reply(`= ${num1 / num2}`)
//             break
//     }

    
//     // await ctx.reply(`Hello ${first_name+" "+ last_name}`)
    
//     // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)
//     // Using context shortcut
//     // console.log(ctx)
//     // await ctx.reply(`Hello ${ctx.state.bot}`)
// })

// bot.hears("hi", (ctx) => ctx.reply('Hey there', message))
// // bot.help(ctx => ctx.reply("how can i help you"))

// bot.launch()