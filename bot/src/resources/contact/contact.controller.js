const fetch = require('node-fetch')
const CONFIG = require('./../../config/config')
const helper = require('./../../helper')
const text = require('./../../texts')

const recycleContact = async (msg) => {

	// get to know user's language
	const userLang = await helper.getUserLang(helper.getChatId(msg))

	// if user's phone number is good then send main menu
	if(Boolean(helper.getContact(msg))) {

		// send main menu
		bot.sendMessage(
			helper.getChatId(cb), 
			text.mainMenu[userLang], 
			{
				parse_mode: 'html',
				reply_markup: {
	  			keyboard: [
	  				[{ text: text.userPhoneBtn[userLang], request_contact: true }]
	  			],
	  			resize_keyboard: true
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
