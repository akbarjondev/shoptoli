const { Router } = require('express')
const controller = require('./admin.controller')
const { verify } = require('./../../libs/jwt/jwt')

const router = Router()

router.use((req, res, next) => {
	const { token } = req.headers

	if(req.path !== '/login') {
		
		// here we check the token in header
		try {
			const decoded = verify(token)

		} catch(e) {
			console.log(e)

			res.send({
				code: 401,
				message: e.message
			}).status(401)
		}

		next()
	} else {
		// next()
	}


})

// /admin/orders
router
	.route('/orders')
	.put(controller.editOne)

// fetch all orders by pagination and language
router
	.route('/orders/:language/:page_size/:page_number')
	.get(controller.getAll)

// /admin/orders/:id
router
	.route('/orders/:id')
	.get(controller.getOne)

module.exports = router
