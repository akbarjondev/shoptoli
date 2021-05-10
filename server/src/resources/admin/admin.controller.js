const { sign } = require('./../../libs/jwt/jwt')
const model = require('./admin.model')

const getAll = async (req, res) => {

	const { language = 'uz', page_number = 1, page_size = 7 } = req.params

	try {
		
		const allOrders = await model.many([ language, page_number, page_size ])

		if(allOrders.length > 0) {
			res.send({
				status: 200,
				message: 'fetch all',
				data: allOrders
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

const getClientOrders = async (req, res) => {

	const { language = 'uz', client_id } = req.params

	try {
		
		const allOrders = await model.getClientOrders([ language, client_id ])

		if(allOrders.length > 0) {
			res.send({
				status: 200,
				message: 'fetch all',
				data: allOrders
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

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

	const { order_id, language } = req.params

	try {
		
		const getOneOrder = await model.getOneOrder([ language, order_id ])

		res.send({
			status: 200,
			message: 'ok',
			data: getOneOrder
		})

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}	
	
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

const login = async (req, res) => {
	
	const { username, password } = req.body

	try {
		
		const loginRes = await model.login([ username, password ])

		if(loginRes.length > 0) {
			
			const token = sign(loginRes[0]) // 

			res.send({
				status: 200,
				message: 'sign in',
				data: loginRes,
				token 
			})

		} else {

			res.send({
				status: 401,
				message: 'username or password incorrect'
			}).status(401)

		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

const getAllClients = async (req, res) => {

	try {

		const { language, page_size, page_number } = req.params
		
		const allClients = await model.getAllClients([ language, page_size, page_number ])

		if(allClients.length > 0) {
			res.send({
				status: 200,
				message: 'fetch all',
				data: allClients
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

//========= CATAGORY =========//

const createCatagories = async (req, res) => {

	try {

		const { catagory_status, catagory_keyword } = req.body

		const catagories = await model.createCatagories([ catagory_status, catagory_keyword ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'ok',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

const getCatagories = async (req, res) => {

	try {

		const catagories = await model.getCatagories()

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'fetch all',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

const setCatagories = async (req, res) => {

	try {

		const { catagory_status, catagory_keyword, catagory_id } = req.body

		const catagories = await model.setCatagories([ catagory_status, catagory_keyword, catagory_id ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'catagory edited',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

const deleteCatagories = async (req, res) => {

	try {

		const { catagory_id } = req.body

		const catagories = await model.deleteCatagories([ catagory_id ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'delete catagory',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

// ======= CATAGORIES INFO  ======= //

const createCatagoriesInfo = async (req, res) => {

	try {

		const { catagory_info_name, language_id, catagory_id } = req.body

		const catagories = await model.createCatagoriesInfo([ catagory_info_name, language_id, catagory_id ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'catagory info created',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

const getCatagoriesInfo = async (req, res) => {

	try {

		const { catagory_id } = req.query

		console.log(req.query)

		const catagories = await model.getCatagoriesInfo([ catagory_id ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'get all catagories info',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

// update
const setCatagoriesInfo = async (req, res) => {

	try {

		const { catagory_info_name, language_id, catagory_info_id } = req.body

		const catagories = await model.setCatagoriesInfo([ catagory_info_name, language_id, catagory_info_id ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'update catagories info',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

// delete
const deleteCatagoriesInfo = async (req, res) => {

	try {

		const { catagory_info_id } = req.body

		const catagories = await model.deleteCatagoriesInfo([ catagory_info_id ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'delete catagories info',
				data: catagories
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

// ======= PRODUCTS  ======= //

const createProducts = async (req, res) => {

	try {

		const { product_price, product_image, product_status, catagory_id } = req.body

		const data = await model.createProducts([ product_price, product_image, product_status, catagory_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'product created',
				data: data
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

// get
const getProducts = async (req, res) => {

	try {

		const { product_id } = req.query

		const data = await model.getProducts([ product_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'ok',
				data: data
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

// update
const setProducts = async (req, res) => {

	try {

		const { product_price, product_image, product_status, catagory_id, product_id } = req.body

		const data = await model.setProducts([ product_price, product_image, product_status, catagory_id, product_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'ok',
				data: data
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}

// delete
const deleteProducts = async (req, res) => {

	try {

		const { product_id } = req.body

		const data = await model.deleteProducts([ product_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'ok',
				data: data
			})
		} else {
			res.send({
				status: 200,
				message: 'no data',
			})
		}

	} catch(e) {
		console.log(e)

		res.send({
			status: 500,
			message: e.message
		})
	}

}


module.exports = {
	getAll,
	createOne,
	getOne,
	editOne,
	deleteOne,
	login,
	getClientOrders, // clients
	getAllClients, // clients
	getCatagories, // catagory
	setCatagories, // catagory
	deleteCatagories, // catagory
	createCatagories, // catagory
	createCatagoriesInfo, // info
	getCatagoriesInfo, // info
	setCatagoriesInfo, // info
	deleteCatagoriesInfo, // info
	createProducts, // prodcuts
	getProducts, // prodcuts
	setProducts, // prodcuts
	deleteProducts, // prodcuts
}
