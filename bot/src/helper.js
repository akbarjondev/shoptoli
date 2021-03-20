module.exports = {
	getChatId (msg) {
		return msg.chat.id
	},
	
	logStart () {
		console.log('Bot started...')
	},
}