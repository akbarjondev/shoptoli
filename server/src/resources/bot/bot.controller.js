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

module.exports = {
	addClient,
	getOneClient,
	addStep,
	editStep,
	getStep,
}
