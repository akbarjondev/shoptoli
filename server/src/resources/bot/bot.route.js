const { Router } = require('express')
const controller = require('./bot.controller')

const router = Router()

// /bot/clients
router
	.route('/client')
	.post(controller.addClient)

// /bot/client/:tg_id 
router
	.route('/client/:tg_user_id')
	.get(controller.getOneClient)

// /bot/step
router
	.route('/step')
	.post(controller.addStep)
	.put(controller.editStep)

// /bot/step/:tg_user_id
router
	.route('/step/:tg_user_id')
	.get(controller.getStep)


module.exports = router
