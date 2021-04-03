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

// edit step

const editStep = async (msg, step_name) => {

	try {

		const editStep = await fetch(`${CONFIG.SERVER_HOST}/bot/step`, {
			method: 'put',
			headers: {
	      'Content-Type': 'application/json'
	    },
			body: JSON.stringify({
				step_name: step_name,
				tg_user_id: helper.getChatId(msg)
			})
		})

		return await editStep.json()

	} catch(e) {
		console.log(e)
	}

}

// returns Obj{status, data, message}
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
	editStep,
}
