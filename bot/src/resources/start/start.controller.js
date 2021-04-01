const helper = require('./../../helper')
const model = require('./start.model')
const step = require('./../step/step.model')

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

		} // end of if()
	}


}

module.exports = {
	firstStart,
}
