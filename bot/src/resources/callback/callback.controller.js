const helper = require('./../../helper')

const getAction = async (cb) => {

	const langArr = cb.data.split(':')

	if(langArr[0] === 'lang') {

		if(langArr[1] === 'uz') {
			bot.answerCallbackQuery(cb.id, 'Til tanlandi')
		} else {
			bot.answerCallbackQuery(cb.id, 'Язык выбран')
		}

	}

}

module.exports = {
	getAction
}
