const fetch = require('node-fetch')
const CONFIG = require('./../../config/config')
const helper = require('./../../helper')
const text = require('./../../texts')
const step = require('./../step/step.model')

const recycleContact = async (msg) => {

	// get to know user's language
	const userLang = await helper.getUserLang(helper.getChatId(msg))

	// if user's phone number is good then send main menu
	const contact = helper.getContact(msg)

	// get user's step
	const userStep = await step.getStep(msg)

	if(Boolean(contact) && userStep.data[0].step_name === 'contact') {

		// insert phone to the database
		helper.setPhone(helper.getChatId(msg), contact.phone_number)

		// change step
		step.editStep(msg, 'menu')

		// send main menu
		bot.sendMessage(
			helper.getChatId(msg), 
			text.mainMenu.text[userLang], 
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
	
	} else {

		// if user send fake phone number
		bot.sendMessage(
			helper.getChatId(msg), 
			text.fakeNumberText[userLang],
			{
				parse_mode: 'html',
			}
		) // end of sendMessage

	}

} // end of recycleContact

module.exports = {
	recycleContact,
}
