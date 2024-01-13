"use strict";

import TelegramBot from "node-telegram-bot-api";
import express, { json } from "express";

const token = process.env.TOKEN;
const webAppUrl = process.env.URL;

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(json());

bot.on("message", async (msg) => {
	const chatId = msg.chat.id;
	const text = msg.text;
	const game_short_name = process.env.GAME_SHORT_NAME;

	if (text === "/start") {
		await bot.sendGame(chatId, game_short_name);
	}
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
	bot.answerCallbackQuery(callbackQuery.id, { url: webAppUrl });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server started on PORT " + PORT));
