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
			// get general info
			const getGeneralInfo = await fetch(`${CONFIG.SERVER_HOST}/bot/infos`)
			const response = await getGeneralInfo.json()
			const company = response.data[0].info_company_name
			const link = response.data[0].info_catalog_link

			// get catagories
			const rawData = await fetch(`${CONFIG.SERVER_HOST}/bot/catagories`)
			const { data } = await rawData.json()

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

			bot.sendMessage(
				helper.getChatId(msg), 
				`
					<b>${company.toUpperCase()}</b> <a href="${link}">ℹ️</a>\n\n<b>${text.sendCatalog[userLang]}</b>
				`,
				{
					parse_mode: 'html',
					reply_markup: {
						inline_keyboard: inlineKeyboard
					}
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
