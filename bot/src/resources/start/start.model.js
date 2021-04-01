const fetch = require('node-fetch')

const CONFIG = require('./../../config/config')
const helper = require('./../../helper')

//=========================== CLIENT ===========================//

const addClient = async (msg) => {

	try {

		const clientRes = await fetch(`${CONFIG.SERVER_HOST}/bot/client`, {
			method: 'post',
			headers: {
	      'Content-Type': 'application/json'
	    },
			body: JSON.stringify(helper.getClientObj(msg))
		})

		return await clientRes.json()

	} catch(e) {
		console.log(e)
	}

}

module.exports = {
	addClient,
}
