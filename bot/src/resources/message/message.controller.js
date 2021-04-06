const fetch = require('node-fetch')
const CONFIG = require('./../../config/config')
const helper = require('./../../helper')
const text = require('./../../texts')

const getAction = async (msg) => {

	// get to know user's language
	const userLang = await helper.getUserLang(helper.getChatId(msg))

	// user ask catalog
	if(msg.text === text.mainMenu.keyboard.order[userLang]) {

		try {
			
			const getGeneralInfo = await fetch(`${CONFIG.SERVER_HOST}/bot/infos`)

			const response = await getGeneralInfo.json()

			const company = response.data[0].info_company_name
			const link = response.data[0].info_catalog_link

			bot.sendMessage(
				helper.getChatId(msg), 
				`
					<b>${company.toUpperCase()}</b> <a href="${link}">ℹ️</a>\n\n<b>${text.sendCatalog[userLang]}</b>
				`,
				{
					parse_mode: 'html'
				}
			)

		} catch(e) {
			console.log(e)
		}

	}


}

module.exports = {
	getAction,
}
