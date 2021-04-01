const fetch = require('node-fetch')

const CONFIG = require('./../../config/config')
const helper = require('./../../helper')

//=========================== STEP ===========================//

const addStep = async (msg, step_name = 'start') => {

	try {

		const addStep = await fetch(`${CONFIG.SERVER_HOST}/bot/step`, {
			method: 'post',
			headers: {
	      'Content-Type': 'application/json'
	    },
			body: JSON.stringify({
				step_name: step_name,
				tg_user_id: helper.getChatId(msg)
			})
		})

		return await addStep.json()

	} catch(e) {
		console.log(e)
	}

}

const getStep = async (msg) => {

	try {

		const getStep = await fetch(`${CONFIG.SERVER_HOST}/bot/step/${helper.getChatId(msg)}`)

		return await getStep.json()

	} catch(e) {
		console.log(e)
	}

}

module.exports = {
	addStep,
	getStep,
}
