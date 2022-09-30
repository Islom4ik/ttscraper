const { Telegraf } = require('telegraf');
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN);
const caliph_api = require('caliph-api');

bot.start((ctx) => ctx.replyWithPhoto({source: './savetiklogo.png'}, {parse_mode: "HTML", caption: 'Приветствую!\nСкинь ссылку на видео из Тик-Тока а бот скинет тебе видео\n<a href="https://t.me/dimesproduction">DIMES PRODUCTION</a>'}));
bot.help((ctx) => ctx.replyWithHTML('/start - запуск бота\nПоддержка - <a href="https://t.me/dimesproduction">DIMES PRODUCTION</a>'));
bot.launch();


bot.on("message", async (ctx) => {
    try {
        const links = ctx.message.text.match(/https?:\/\/(www\.)?[vt.tiktok.com]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g)
        if(links) {
            let result = await caliph_api.downloader.tiktok(ctx.message.text);
            await ctx.replyWithVideo({url: result.watermark}, {reply_to_message_id: ctx.message.message_id})
        }else {
            return
        } 
    }catch(e) {
        console.error(e);
    }


})


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));