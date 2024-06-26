var TelegramBot = require("node-telegram-bot-api");
var express = require("express");
var json = require("express").json;
var dotenv = require("dotenv");
var langdetect = require("langdetect");
var fs = require("fs");

dotenv.config();

var token = process.env.TOKEN;
var webAppUrl = process.env.URL;

var bot = new TelegramBot(token, { polling: true });
var app = express();

app.use(json());

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const game_short_name = process.env.GAME_SHORT_NAME;

    if (text === "/start") {
        await bot.sendGame(chatId, game_short_name);
    }

    const detectedLanguage = langdetect.detectOne(text);
    console.log("Detected language: ", detectedLanguage);

    bot.getChat(chatId).then(chat => {
        console.log("User information: ", chat);

        const logEntry = `Chat ID: ${chatId}\nUsername: ${chat.username}\nFirst Name: ${chat.first_name}\nLast Name: ${chat.last_name}\nLanguage: ${detectedLanguage}\n\n`;
        fs.appendFile("user_data.txt", logEntry, (err) => {
            if (err) throw err;
            console.log("User data saved!");
        });
    });

    bot.getUserProfilePhotos(chatId).then(photos => {
        console.log("User profile photos: ", photos);
        if (photos.total_count > 0) {
            const photoId = photos.photos[0][0].file_id;
            bot.getFileLink(photoId).then(url => {
                console.log("Profile photo URL: ", url);
            });
        }
    });
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
    bot.answerCallbackQuery(callbackQuery.id, { url: webAppUrl });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
