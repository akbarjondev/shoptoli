const fetch = require('node-fetch')
const CONFIG = require('./config/config')

module.exports = {
	getChatId (msg) {
		return msg?.chat?.id || msg?.message?.chat?.id
	},

	getMsgId (msg) {
		return msg?.message_id || msg?.message?.message_id
	},

	getName (msg) {
		return msg?.from?.first_name
	},

	getLang (msg) {
		return msg?.from?.language_code
	},

	getUserObj: async (chatId, id = false) => {
		const getUserLangRes = await fetch(`${CONFIG.SERVER_HOST}/bot/client/lang/${chatId}`)
		const res = await getUserLangRes.json()

		if(id) {
			return res.data[0].id
		} else {
			return res.data[0].language
		}
	},

	getClientObj: (msg) => {
		return {
			tg_user_id: msg.from.id,
			tg_first_name: msg.from.first_name,
			tg_last_name: msg.from?.last_name || '',
			tg_username: msg.from?.username || ''
		}
	},
	
	logStart: () => {
		console.log('Bot started...')
	},

	debug: (obj) => {
		return JSON.stringify(obj, null, 4)
	},

	getRegions: async (language) => {
		const getRegions = await fetch(`${CONFIG.SERVER_HOST}/bot/regions/${language}`)
		const res = await getRegions.json()

		return res.data
	},

	setRegion: async (chatId, regionId) => {
		const setRegion = await fetch(`${CONFIG.SERVER_HOST}/bot/regions`, {
			method: 'put',
			headers: {
	      'Content-Type': 'application/json'
	    },
			body: JSON.stringify({
				region_id: regionId,
				tg_user_id: chatId
			})
		})

		return await setRegion.json()
	},

	getContact: (msg) => {
		
		if(msg?.contact?.user_id === msg?.from?.id){
			return msg?.contact
		} else {
			return null
		}

	},

	setPhone: async (chatId, phoneNumber) => {
		const setRegion = await fetch(`${CONFIG.SERVER_HOST}/bot/client/contact`, {
			method: 'put',
			headers: {
	      'Content-Type': 'application/json'
	    },
			body: JSON.stringify({
				phone_number: phoneNumber,
				tg_user_id: chatId
			})
		})

		return await setRegion.json()
	},

	kbdGenerate: (data, name_in_cb_data, kdbInRow = 1, back = false) => {

		// generate inline buttons
		let inlineKeyboard = []
    let buttonsRow = []

    for (let i = 0; i < data.length; i++) {

      buttonsRow.push({ text: data[i].name, callback_data: name_in_cb_data + ':' + data[i].id + ':pid:' + data[i].product_id })
      
      if(buttonsRow.length === kdbInRow) {
        inlineKeyboard.push([...buttonsRow])
        buttonsRow.length = 0
      }

      if((data.length - 1) === i) {
        inlineKeyboard.push([...buttonsRow])
      }
    }

    if(typeof back === 'boolean' && back !== false) {
      inlineKeyboard.push([{ text: '🔙', callback_data: 'back' + ':' + 'cat_id:' + data[0]?.cat_id }])
    } else if(typeof back === 'string') {
      inlineKeyboard.push([{ text: '🔙', callback_data: 'back' + ':' + back + ':' + data[0]?.cat_id }])
    }

    return inlineKeyboard
	},

	getCompanyInfo: async () => {
		// get general info
		const getGeneralInfo = await fetch(`${CONFIG.SERVER_HOST}/bot/infos`)
		const response = await getGeneralInfo.json()

		return {
			name: response.data[0].info_company_name,
			link: response.data[0].info_catalog_link
		}
	}
}