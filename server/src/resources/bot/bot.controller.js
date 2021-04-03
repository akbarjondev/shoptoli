const model = require('./bot.model')

//=========================== CLIENT ===========================//

const addClient = async (req, res) => {

	const { tg_user_id, tg_first_name, tg_last_name, tg_username } = req.body

	const dbCleintRes = await model.addClient([ tg_user_id, tg_first_name, tg_last_name, tg_username ])

	res.send(dbCleintRes).end()
}

const getOneClient = async (req, res) => {

	const { tg_user_id } = req.params

}

const editOneClient = async (req, res) => {

	const { tg_user_id, language_id } = req.body

	const dbEditCleint = await model.editClient([ tg_user_id, language_id ])

	res.send(dbEditCleint).end()
}

const getClientLang = async (req, res) => {

	const { tg_user_id } = req.params

	const getClientLang = await model.knowLang([ tg_user_id ])

	res.send(getClientLang).end()
}

const setClientContact = async (req, res) => {

	const { tg_user_id, phone_number } = req.body

	const modelSetClientContact = await model.setContact([ phone_number, tg_user_id ])

	res.send(modelSetClientContact).end()
}

//=========================== STEP ===========================//

const getStep = async (req, res) => {

	const { tg_user_id } = req.params

	const dbStepRes = await model.getStep([tg_user_id])

	res.send(dbStepRes).end()
}

const addStep = async (req, res) => {

	const { tg_user_id, step_name } = req.body

	const dbStepRes = await model.addStep([step_name, tg_user_id])

	res.send(dbStepRes).end()
}

const editStep = async (req, res) => {

	const { tg_user_id, step_name } = req.body

	const dbStepRes = await model.editStep([step_name, tg_user_id])

	res.send(dbStepRes).end()
}

//=========================== REGIONS ===========================//

const getRegions = async (req, res) => {

	const { language } = req.params

	const dbGetRegions = await model.getRegions([ language ])

	res.send(dbGetRegions).end()
}

const setRegion = async (req, res) => {

	const { region_id, tg_user_id } = req.body

	const dbSetRegion = await model.setRegion([ region_id, tg_user_id ])

	res.send(dbSetRegion).end()
}

module.exports = {
	addClient, // client
	getOneClient, // client
	editOneClient, // client
	getClientLang, // language
	setClientContact, // contact
	addStep, // step
	getStep, // step
	editStep, // step
	getRegions, // region
	setRegion, // region
}
