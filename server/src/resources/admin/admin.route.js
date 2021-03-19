const { Router } = require('express')
const controller = require('./admin.controller')

const router = Router()

// /admin/orders
router
	.route('/carts')
	.get(controller.getAll)
	.post(controller.createOne)

// /admin/order/:id
router
	.route('/cart/:id')
	.get(controller.getOne)
	.put(controller.editOne)
	.delete(controller.deleteOne)

module.exports = router
