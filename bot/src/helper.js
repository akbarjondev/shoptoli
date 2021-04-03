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

	getUserLang: async (chatId) => {
		const getUserLangRes = await fetch(`${CONFIG.SERVER_HOST}/bot/client/lang/${chatId}`)
		const res = await getUserLangRes.json()

		return res.data[0].language
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
}