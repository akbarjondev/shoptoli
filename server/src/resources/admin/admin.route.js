const { Router } = require('express')
const controller = require('./admin.controller')
const { verify } = require('./../../libs/jwt/jwt')
const cors = require('cors')

const router = Router()

router.use(cors())

// { 
// 	origin: 'http://localhost',
// 	optionsSuccessStatus: 200
// }

router.use((req, res, next) => {
	const { token } = req.headers

	if(req.path !== '/login') {
		
		// here we check the token in header
		try {
			const decoded = verify(token)

			next()
		} catch(e) {
			console.log(e)

			res.send({
				code: 401,
				message: e.message
			}).status(401)
		}

	} else {
		next()
	}

})

// /admin/login
router
	.route('/login')
	.post(controller.login)

// /admin/orders
router
	.route('/orders')
	.put(controller.editOne)

// fetch all orders by pagination and language
router
	.route('/orders/:language/:page_size/:page_number')
	.get(controller.getAll)

// get one Client's all orders
router
	.route('/orders/:language/:client_id')
	.get(controller.getClientOrders)

// /admin/orders/:id
router
	.route('/order/:language/:order_id')
	.get(controller.getOne)

// get all clients with count orders
router
	.route('/clients/:language/:page_size/:page_number')
	.get(controller.getAllClients)

router
	.route('/catagory')
	.get(controller.getCatagories)
	.put(controller.setCatagories)
	.delete(controller.deleteCatagories)
	.post(controller.createCatagories)

module.exports = router
