module.exports = {
	getChatId (msg) {
		return msg?.chat?.id || msg?.message?.chat?.id
	},

	getName (msg) {
		return msg?.from?.first_name
	},

	getLang (msg) {
		return msg?.from?.language_code
	},

	getClientObj (msg) {
		return {
			tg_user_id: msg.from.id,
			tg_first_name: msg.from.first_name,
			tg_last_name: msg.from?.last_name || '',
			tg_username: msg.from?.username || ''
		}
	},
	
	logStart () {
		console.log('Bot started...')
	},

	debug (obj) {
		return JSON.stringify(obj, null, 4)
	},
}