const { Telegraf, Markup } = require('telegraf');
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN);
const caliph_api = require('caliph-api');

bot.start((ctx) => ctx.replyWithPhoto({source: './savetiklogo.png'}, {parse_mode: "HTML", caption: 'Приветствую!\nСкинь ссылку на видео из Тик-Тока а бот скинет тебе видео\n<a href="https://t.me/dimesproduction">DIMES PRODUCTION</a>'}));
bot.help((ctx) => ctx.replyWithHTML('/start - запуск бота\nПоддержка - <a href="https://t.me/dimesproduction">DIMES PRODUCTION</a>'));
bot.launch({dropPendingUpdates: true});

let msgText;
let video;
bot.command("audio", async ctx => {
    try {
        msgText = ctx.message.text.split(' ')[1];
        if(ctx.message.text.split(' ')[1] == undefined){
            return await ctx.reply('⁉️ Вы не прислали ссылку...\nПример:\n-  /audio https://vt.tiktok.com', {disable_web_page_preview: true})
        }else {
            const link = msgText.match(/https?:\/\/(www\.)?[vt.tiktok.com]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g)
            if(link) {
                let result = await caliph_api.downloader.tiktok(msgText);
                video = await ctx.replyWithAudio({url: result.audio, filename: result.title}, {
                    ...Markup.inlineKeyboard(
                        [
                            [Markup.button.callback('Видео', 'vid')]
                        ]
                    ), reply_to_message_id: ctx.message.message_id
                })
            }else if(!link) {
                return await ctx.reply('Я не понял вашу ссылку...')
            }else {
                return
            }
        }
        
    }catch(e) {
        console.error(e);
    }
})

bot.action('vid', async ctx => {
    try {
        await ctx.answerCbQuery('Работаю над этим');
        let result = await caliph_api.downloader.tiktok(msgText);
        await ctx.replyWithVideo({url: result.watermark}, {reply_to_message_id: video.message_id})
    }catch(e) {
        console.error(e);
    }
})

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
        return await ctx.reply('😕 Мне не удалось скачать данное видео...', {reply_to_message_id: ctx.message.message_id})
    }
})




process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));