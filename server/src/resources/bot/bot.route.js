const { Router } = require('express')
const controller = require('./bot.controller')

const router = Router()

// ++++++++++++++++ CLIENT ++++++++++++++++++++++++

// /bot/clients
router
	.route('/client')
	.post(controller.addClient)
	.put(controller.editOneClient)

// ++++++++++++++++++++++++++++++++++++++++

// /bot/client/:tg_id 
router
	.route('/client/:tg_user_id')
	.get(controller.getOneClient)

router
	.route('/client/lang/:tg_user_id')
	.get(controller.getClientLang)

router
	.route('/client/contact')
	.put(controller.setClientContact)
router
	.route('/client/name')
	.put(controller.setClientName)

// ++++++++++++++++ STEP ++++++++++++++++++++++++

// /bot/step
router
	.route('/step')
	.post(controller.addStep)
	.put(controller.editStep)

// /bot/step/:tg_user_id
router
	.route('/step/:tg_user_id')
	.get(controller.getStep)

// ++++++++++++++++ REGIONS ++++++++++++++++++++++++
router
	.route('/regions')
	.put(controller.setRegion)

router
	.route('/regions/:language')
	.get(controller.getRegions)

// ++++++++++++++++ INFOS +++++++++++++++++++++
router
	.route('/infos')
	.get(controller.getInfos)

// ++++++++++++++++ CATAGORIES +++++++++++++++++++++
router
	.route('/catagories/:language')
	.get(controller.getCatagories)

// ++++++++++++++++ PRODUCTS +++++++++++++++++++++
router
	.route('/products/:catagory_id/:language_id')
	.get(controller.getProducts)

// ++++++++++++++++ PRODUCT +++++++++++++++++++++
router
	.route('/product/:product_id/:language_id')
	.get(controller.getProduct)

// ++++++++++++++++ ORDERS +++++++++++++++++++++
router
	.route('/orders')
	.post(controller.createOrder)
	.put(controller.editOrder)

router
	.route('/orders/:tg_user_id')
	.get(controller.getClientOrder)

router
	.route('/myorders/:tg_user_id/:language_id')
	.get(controller.getMyOrders)

// ++++++++++++++++ ORDERITEMS +++++++++++++++++++++
router
.route('/orderitems')
.post(controller.createOrderItem)

router
.route('/orderitems/:order_id/:language_id')
.get(controller.getClientOrderItems)

// ++++++++++++++++ ORDERSTEPS+++++++++++++++++++++
router
.route('/ordersteps/:tg_user_id/:product_id')
.post(controller.addOrdersteps)
.get(controller.getOrdersteps)

// ++++++++++++++++ bookorder +++++++++++++++++++++
router
	.route('/bookorder')
	.post(controller.bookOrder)

module.exports = router
