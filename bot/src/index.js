require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const helper = require('./helper')
const start = require('./resources/start/start.controller')
const message = require('./resources/message/message.controller')
const callback = require('./resources/callback/callback.controller')

const bot = new TelegramBot(process.env.token, { polling: true })

global.bot = bot

// helper for logging bot starting
helper.logStart()

// for only /start command
bot.onText(/\/start/, start.firstStart)

// bot gets all kind of text messages
bot.on('message', message.getAction)

// bot gets callbacks from inline buttons
bot.on('callback_query', callback.getAction)
