require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const helper = require('./helper')
const start = require('./resources/start/start.controller')
const message = require('./resources/message/message.controller')
const callback = require('./resources/callback/callback.controller')

const bot = new TelegramBot(process.env.token, { polling: true })

global.bot = bot

helper.logStart()

bot.onText(/\/start/, start.firstStart)

bot.on('message', message.getAction)

bot.on('callback_query', callback.getAction)
