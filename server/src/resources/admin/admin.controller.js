const model = require('./admin.model')

const getAll = async (req, res) => {

	const { language = 'uz', page_number = 1, page_size = 7 } = req.params

	try {
		
		const allOrders = await model.many([ language, page_number, page_size ])

		res.send({
			status: 200,
			message: 'fetch all',
			data: allOrders
		})

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

const createOne = async (req, res) => {
	
}

const getOne = async (req, res) => {
	
}

const editOne = async (req, res) => {
	
	const { order_id, order_status } = req.body


	try {
		
		const editOrder = await model.editOrder([ order_id, order_status ])

		res.send({
			status: 200,
			message: 'edit order',
			data: editOrder
		})

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

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
