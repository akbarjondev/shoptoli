const helper = require('./../../helper')
const model = require('./start.model')
const step = require('./../step/step.model')
const text = require('./../../texts')

const firstStart = async (msg) => {

	// know step
	const getStepRes = await step.getStep(msg)
	
	if(getStepRes.status === 404) {

		await step.addStep(msg)

		const addClientRes = await model.addClient(msg)

		if(addClientRes.status === 200) {

			let hello_text, lang_text
			
			let lang = {
				uz: {
					uz_text: '🇺🇿 Uzb',
					ru_text: '🇷🇺 Rus'
				},
				ru: {
					uz_text: '🇺🇿 Узб',
					ru_text: '🇷🇺 Рус'
				},
			}

			if(helper.getLang(msg) === 'en' || helper.getLang(msg) === 'uz') {
				hello_text = `Assalomu alaykum <b>${helper.getName(msg)}</b>\n\n<b>Interfeys tilini tanlang:</b>`
				lang_text = lang.uz
			} else {
				hello_text = `Здравствуйте <b>${helper.getName(msg)}</b>\n\n<b>Выберите язык интерфейса:</b>`
				lang_text = lang.ru
			}

			bot.sendMessage(
				helper.getChatId(msg), 
				hello_text, 
				{ 
					parse_mode: 'html',
					reply_markup: {
						inline_keyboard: [
							[
								{ text: lang_text.uz_text, callback_data: 'lang:uz' },
								{ text: lang_text.ru_text, callback_data: 'lang:ru' }
							]
						]
					}
				}
			) // end of sendMessage

			// delete /start message ;)
			bot.deleteMessage(
				helper.getChatId(msg),
				helper.getMsgId(msg)
			)

		} // end of if()
	} else {

		const step_name_ = getStepRes.data[0].step_name

		if(step_name_ === 'catagories' || step_name_ === 'menu') {

			// get to know user's language
			const userLang = await helper.getUserObj(helper.getChatId(msg))

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
		}

	}

}

module.exports = {
	firstStart,
}
