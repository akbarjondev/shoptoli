const fetch = require('node-fetch')
const CONFIG = require('./../../config/config')
const helper = require('./../../helper')
const text = require('./../../texts')
const step = require('./../step/step.model')

const getAction = async (msg) => {

	// get to know user's language
	const userLang = await helper.getUserObj(helper.getChatId(msg))

	// user ask catalog
	if(msg.text === text.mainMenu.keyboard.order[userLang]) {

		try {
			// get general info
			const info = await helper.getCompanyInfo()
			
			// get catagories
			const rawData = await fetch(`${CONFIG.SERVER_HOST}/bot/catagories/${userLang}`)
			const { data } = await rawData.json()

			// generate inline buttons
			let inlineKeyboard = helper.kbdGenerate(data, 'catagory', 1)

			bot.sendMessage(
				helper.getChatId(msg), 
				`
					<b>${info.name.toUpperCase()}</b>\n\n<a href="${info.link}">📖</a> <b>${text.sendCatalog[userLang]}</b>
				`,
				{
					parse_mode: 'html',
					reply_markup: {
						inline_keyboard: inlineKeyboard
					}
				}
			)

			// delete old message with inline keyboard
			bot.deleteMessage(
				helper.getChatId(msg), 
				helper.getMsgId(msg)
			)

			// edit step from start to catagories
			step.editStep(msg, 'catagories')

		} catch(e) {
			console.log(e)
		}

	}


}

module.exports = {
	getAction,
}
