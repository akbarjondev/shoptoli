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

// get catagory infos by cata
const getOneCatagory = async (req, res) => {

	try {

		const { catagory_id, language } = req.params

		console.log(catagory_id)

		const catagories = await model.getOneCatagory([ catagory_id, language ])

		if(catagories.length > 0) {
			res.send({
				status: 200,
				message: 'fetch two',
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

		const data = await model.getProducts()

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'fetch',
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

// get one
const getOneProduct = async (req, res) => {

	try {

		const { product_id, language } = req.params

		const data = await model.getOneProduct([ product_id, language ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'fetch',
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
				message: 'update product',
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
				message: 'delete product',
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

// ======= PRODUCTS INFO  ======= //

// create
const createProdcutsInfo = async (req, res) => {

	try {

		const { product_info_name, product_info_desc, language_id, product_id } = req.body

		const data = await model.createProdcutsInfo([ product_info_name, product_info_desc, language_id, product_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'product info created',
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

// read
const getProdcutsInfo = async (req, res) => {

	try {

		const { product_info_id } = req.query

		const data = await model.getProdcutsInfo([ product_info_id ])

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
const setProdcutsInfo = async (req, res) => {

	try {

		const { product_info_name, product_info_desc, language_id, product_id, product_info_id } = req.body

		const data = await model.setProdcutsInfo([ product_info_name, product_info_desc, language_id, product_id, product_info_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'update product info',
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
const deleteProdcutsInfo = async (req, res) => {

	try {

		const { product_info_id } = req.body

		const data = await model.deleteProdcutsInfo([ product_info_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'delete product info',
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

//============= ADMINS ===============//

// create
const createAdmin = async (req, res) => {

	try {

		const { admin_username, admin_password } = req.body

		const data = await model.createAdmin([ admin_username, admin_password ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'creat admin',
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
const getAdmins = async (req, res) => {

	try {

		const data = await model.getAdmins()

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'fetch admins',
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
const deleteAdmin = async (req, res) => {

	try {

		const { admin_id } = req.body

		const data = await model.deleteAdmin([ admin_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'delete admin',
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

//============== SEARCH ================//

// fetch
const search = async (req, res) => {

	try {

		const { q } = req.query

		const data = await model.search([ q ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'ok',
				data: data
			})
		} else {
			res.send({
				status: 204,
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

//============== STATS ================//

// fetch
const getStats = async (req, res) => {

	try {

		const date = new Date()

		const { year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getUTCDate(), status = 1 } = req.query

		let dataArray

		if(status == 1) {
			dataArray = await model.getStatsByDay([ year, month, day ])
		} else if (status == 2) {
			dataArray = await model.getStatsByMonth([ year, month ])
		} else if (status == 3) {
			dataArray = await model.getStatsByYear([ year ])
		} else if (status == 4) {
			dataArray = await model.getStatsByWeek()

			// Umarjon's code
			let d = new Date();
			let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			let week = []

			for (let i = 0; i <= 6; i++) {
			  let date = new Date()
			  date.setDate(date.getDate() - i)

			  week.push( {
			    created_day: date.getDate(), 
			    created_week: days[date.getDay()],
			    sum_quantity: 0
			  })   

			}

			week.map(obj=>{
			  dataArray.map(e=>{
			    if (obj.created_day == e.created_day ) {
			      obj.sum_quantity = e.sum_quantity-0 
			    } 
			  })
			})

			dataArray = week.reverse()
			
		} // end of Umarjon's code

		// send response	
		if(dataArray.length > 0) {
			res.send({
				status: 200,
				message: 'ok',
				data: dataArray
			})
		} else {
			res.send({
				status: 204,
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

//============= COMMENTS ===============//

// create
const createComments = async (req, res) => {

	try {

		const { comment_text, order_id, admin_id } = req.body

		const data = await model.createComments([ comment_text, order_id, admin_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'creat comment',
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
const getComments = async (req, res) => {

	try {

		const { order_id } = req.query

		const data = await model.getComments([ order_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'creat comment',
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

// set
const setComments = async (req, res) => {

	try {

		const { comment_text, admin_id, order_id } = req.body

		const data = await model.setComments([ comment_text, admin_id, order_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'update comment',
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


//============= INFOS ===============//

// create
const createInfos = async (req, res) => {

	try {

		const { info_company_name, info_catalog_link, info_media, info_phone, info_address, info_email, info_delivery_price, info_free_delivery_limit } = req.body

		const data = await model.createInfos([ info_company_name, info_catalog_link, info_media, info_phone, info_address, info_email, info_delivery_price, info_free_delivery_limit ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'creat comment',
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
const getInfos = async (req, res) => {

	try {

		const data = await model.getInfos()

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'get comment',
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

// set
const setInfos = async (req, res) => {

	try {

		const { info_company_name, info_catalog_link, info_media, info_phone, info_address, info_email, info_delivery_price, info_free_delivery_limit, info_id } = req.body

		const data = await model.setInfos([ info_company_name, info_catalog_link, info_media, info_phone, info_address, info_email, info_delivery_price, info_free_delivery_limit, info_id ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'set comment',
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

// ============ BADGE ============== //

// set
const setBadge = async (req, res) => {

	try {

		const { client_id, badge } = req.body

		const data = await model.setBadge([ client_id, badge ])

		if(data.length > 0) {
			res.send({
				status: 200,
				message: 'set comment',
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
	getOneCatagory, // catagory
	createCatagoriesInfo, // info
	getCatagoriesInfo, // info
	setCatagoriesInfo, // info
	deleteCatagoriesInfo, // info
	createProducts, // prodcuts
	getProducts, // prodcuts
	getOneProduct, // prodcuts
	setProducts, // prodcuts
	deleteProducts, // prodcuts
	createProdcutsInfo, // info
	getProdcutsInfo, // info
	setProdcutsInfo, // info
	deleteProdcutsInfo, // info
	createAdmin, // admin
	deleteAdmin, //admin
	getAdmins, // admin
	search, // search
	getStats, // stats
	createComments, // comments
	setComments, // comments
	getComments, // comments
	createInfos, // infos
	getInfos, // infos
	setInfos, // infos
	setBadge, // infos
}
