const helper = require('./../../helper')
const fetch = require('node-fetch')

const text = require('./../../texts')
const CONFIG = require('./../../config/config')
const step = require('./../step/step.model')

const getAction = async (cb) => {

	const dataArr = cb.data.split(':')

	// ================ CHANGE LANGUAGE ================ //

	if(dataArr[0] === 'lang') {

		try {
			
			// write user language to the database
			const editClientLang = await fetch(`${CONFIG.SERVER_HOST}/bot/client`, {
				method: 'put',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					tg_user_id: helper.getChatId(cb),
					language_id: dataArr[1]
				})
			})

			// get changed language response
			const response = await editClientLang.json()

			if(response.status === 200) {

				// edit step from start to region
				step.editStep(cb, 'region')
				
				// answer to the presed inline button
				bot.answerCallbackQuery(cb.id, text.selectLang[dataArr[1]], false)

				// get to know user's language
				const userLang = await helper.getUserLang(helper.getChatId(cb))

				// get all regions based on user language
				const data = await helper.getRegions(userLang)

				// generate inline buttons
				let inlineKeyboard = []
	      let buttonsRow = []

	      for (let i = 0; i < data.length; i++) {

	        buttonsRow.push({ text: data[i].name, callback_data: 'region:' + data[i].id })
	        
	        if(buttonsRow.length === 3) {
	          inlineKeyboard.push([...buttonsRow])
	          buttonsRow.length = 0
	        }

	        if((data.length - 1) === i) {
	          inlineKeyboard.push([...buttonsRow])
	        }
	      }

	      // edit message with select region text and buttons
				bot.editMessageText(
					text.askRegion[userLang],
					{
					chat_id: helper.getChatId(cb), 
					message_id: helper.getMsgId(cb),
					reply_markup: {
						inline_keyboard: inlineKeyboard
					}
				})

			}

		} catch(e) {
			console.log(e)
		}

	} // end of changing Language

	// ================ SELECT REGION ================ //

	if(dataArr[0] === 'region') {

		// set user's region
		const regionRes = await helper.setRegion(cb, dataArr[1])

		if(regionRes.status === 200) {

			// get to know user's language
			const userLang = await helper.getUserLang(helper.getChatId(cb))

			// answer for selecting region
			bot.answerCallbackQuery(cb.id, text.selectRegion[userLang], false)

			// bot.

		}

	} // end of select region

} // end of getAction - callback function

module.exports = {
	getAction,
}
