const { Router } = require('express')
const controller = require('./admin.controller')

const router = Router()

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
