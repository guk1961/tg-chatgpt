const TelegramApi = require('node-telegram-bot-api')
// const openai= require("openai");
const { Configuration, OpenAIApi } = require("openai");
const express = require("express")
require("dotenv").config();

// const app = express();
// app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// app.post("/ask", async (req, res) => {
//     const prompt = req.body.prompt;
//
//     try {
//         if (prompt == null) {
//             throw new Error("Uh oh, no prompt was provided");
//         }
//         // trigger OpenAI completion
//         let text = prompt
//         console.log(text)
//         const response = await openai.createCompletion(
//             {
//                 model: "text-davinci-003",
//                 prompt: `${text}`,
//                 max_tokens: 1024,
//                 temperature: 0.5,
//                 // n: 1,
//                 // stop: "\n"
//             }
//         );
//         const completion = response.data.choices[0].text;
//         console.log('response: ',completion)
//         return res.status(200).json({
//             success: true,
//             message: completion,
//         });
//         // ...
//     } catch (error) {
//         console.log('error',error.message);
//     }
// });
//
// const port = process.env.PORT || 5000;
//
// app.listen(port, () => {
//     console.log(`Server started on port = ${port}`)
//     // SyntaxError: Cannot use import statement outside a module
// })
//

const bot = new TelegramApi(process.env.bot_token, {polling: true})

bot.on('message', async msg => {
    // console.log(msg)

    const text = msg.text.trim();
    const chatId = msg.chat.id;

    if (text === '/start'){
        await bot.sendMessage(chatId, `Привет. Я бот для доступа к chatGPT. Задайте вопрос после символа "." и ждите ответа. Будьте терпеливы, я могу задуматься надолго... =)`)
    }else
        if (text.substring(0, 1)==='.') {

        await bot.sendSticker(chatId, 'logo64.png')
        // await bot.sendMessage(chatId, `Ты ввел строку:  ${text}`)


        try {
            if (text == null) {
                throw new Error("Uh oh, no prompt was provided");
            }
            // console.log(text)
            const response = await openai.createCompletion(
                {
                    model: "text-davinci-003",
                    prompt: `${text}`,
                    max_tokens: 1024,
                    temperature: 0.5,
                    // n: 1,
                    // stop: "\n"
                }
            );
            const completion = response.data.choices[0].text;
            // console.log('response: ', completion)
            const res = {
                success: true,
                message: completion,
            };
            await bot.sendMessage(chatId, completion)
        } catch (error) {
            console.log('error', error.message);
        }
    }
})

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
    ])
}

start()
