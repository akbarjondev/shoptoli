require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { logStart } = require('./helper')

const bot = new TelegramBot(process.env.token, { polling: true })

logStart()

bot.onText(/\/start/, (msg) => {

	bot.sendMessage(msg.chat.id, 'working...')
})

bot.on('message', msg => {

	console.log(msg)
	// switch (msg.text) {
	// 	case label_1:
	// 		// statements_1
	// 		break;
	// 	default:
	// 		// statements_def
	// 		break;
	// }

})
