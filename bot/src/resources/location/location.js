const fetch = require('node-fetch')
const CONFIG = require('./../../config/config')
const helper = require('./../../helper')
const step = require('./../step/step.model')
const text = require('./../../texts.js')


const recycleLocation = async (msg) => {

	// get to know user's language
	const userLang = await helper.getUserObj(helper.getChatId(msg))

	// get user's step
	const userStep = await step.getStep(msg)

	// make messages one array
	const msgs = [ helper.getMsgId(msg), msg?.reply_to_message?.message_id ]

	// change user's order status from 0 to 1 - pending
	const bookOrder = await fetch(`${CONFIG.SERVER_HOST}/bot/bookorder`,{
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			tg_user_id: helper.getChatId(msg),
			longitude: msg.location.longitude,
			latitude: msg.location.latitude
		})
	})

	const { data, status } = await bookOrder.json()

	if(status === 200) {

		msgs.forEach(m => {
			// delete old message location keyboard
			bot.deleteMessage(
				helper.getChatId(msg), 
				m
			)
		})

		try {
			// change step
			step.editStep(msg, 'menu')

			// send main menu
			bot.sendMessage(
				helper.getChatId(msg), 
				await text.orderBooked[userLang], 
				{
					parse_mode: 'html',
					reply_markup: {
		  			keyboard: [
							[{ text: text.mainMenu.keyboard.order[userLang] }],
							[
								{ text: text.mainMenu.keyboard.myOrders[userLang] }, 
								{ text: text.mainMenu.keyboard.settings[userLang] }
							]
						],
		  			resize_keyboard: true,
		  			one_time_keyboard: true
		  		}
				}
			) // end of sendMessage

		} catch(e) {
			console.log(e)
		}

	}

}

module.exports = {
	recycleLocation,
}
