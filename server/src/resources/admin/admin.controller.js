const model = require('./admin.model')

const getAll = async (req, res) => {

	res.send(await model.many())

}

const createOne = async (req, res) => {
	
}

const getOne = async (req, res) => {
	
}

const editOne = async (req, res) => {
	
}

const deleteOne = async (req, res) => {
	
}

module.exports = {
	getAll,
	createOne,
	getOne,
	editOne,
	deleteOne
}
