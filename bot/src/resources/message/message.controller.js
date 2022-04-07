const fetch = require('node-fetch')
const CONFIG = require('./../../config/config')
const helper = require('./../../helper')
const text = require('./../../texts')
const step = require('./../step/step.model')
const INLINE_KDBS = require('./../../keyboards/inline_keyboards')

const getAction = async (msg) => {

	// get conpany general info
	const info = await helper.getCompanyInfo()

	// get to know user's language
	const userLang = await helper.getUserObj(helper.getChatId(msg))

	// get user's step
	const userStep = await step.getStep(msg)
	const currentStep = userStep?.data[0]?.step_name

	if(currentStep == 'product') {
		let number_product;
		if(isNaN(parseInt(msg.text))) {
			bot.sendMessage(
				helper.getChatId(msg),
				text.ordersteps[userLang].text,
				{
					parse_mode: 'html',
				}
			)
		} else {
			number_product = parseInt(msg.text)
			
			const product_count = Math.abs(number_product)
	
			// get ordersteps
			const rawData = await fetch(`${CONFIG.SERVER_HOST}/bot/ordersteps/${helper.getChatId(msg)}/0`)
			const { data } = await rawData.json()
			const product_id = data[0].product_id
	
			// change step
			step.editStep(msg, 'cart')
	
			// get ClientOrder by ID
			const getClientOrder = await fetch(`${CONFIG.SERVER_HOST}/bot/orders/${helper.getChatId(msg)}`)
			const { data: [ orderObj ] } = await getClientOrder.json()
	
			// get order_id
			const { order_id } = orderObj
	
			// add product to the orderitems || cart
			const orderItemRes = await fetch(`${CONFIG.SERVER_HOST}/bot/orderitems`, {
				method: 'post',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					order_id: order_id,
					orderitem_quantity: product_count,
					product_id: product_id
				})
			})
	
			const { status, data: orderData } = await orderItemRes.json()
	
			// if orderitem added
			if(status === 200 && orderData.length > 0) {
	
				// get client's all orderitems
				const getClientOrderItems = await fetch(`${CONFIG.SERVER_HOST}/bot/orderitems/${order_id}/${userLang}`)
				const { data: allOrders } = await getClientOrderItems.json()
	
				// delivery will come from company general info table
				let delivery = info.price
				let delivery_limit = info.free_delivery_limit
	
				let countAllProduct = ''
				let productsPrice = 0
				let allProductCount = 0
	
				allOrders.forEach(product => {
					if(product.keyword === 'sale') {
						allProductCount += product.quantity
					}
	
					productsPrice += product.price * product.quantity
					countAllProduct += product.quantity + ` ${text.cart.piece[userLang]} ` + product.name + `\n`
				})
	
				delivery = allProductCount >= delivery_limit ? 0 : delivery
	
				const cartText = `<b>${text.cart.inCart[userLang]}</b>\n\n${countAllProduct}\n<b>${text.cart.goods[userLang]}</b> ${productsPrice} ${text.currency[userLang]}\n<b>${text.cart.deliveryText[userLang]}</b> ${delivery} ${text.currency[userLang]}\n<b>${text.cart.sum[userLang]} ${productsPrice + delivery} ${text.currency[userLang]}</b>`
	
				bot.sendMessage(
					helper.getChatId(msg),
					cartText,
					{
						parse_mode: 'html',
						reply_markup: {
							inline_keyboard: INLINE_KDBS.cart_keyboards(userLang, order_id)
						}
					}
				)
			}
		}
	}

	// user ask catalog
	if(msg.text === text.mainMenu.keyboard.order[userLang]) {

		try {

			// get general info
			const info = await helper.getCompanyInfo()
			
			// get catagories
			const rawData = await fetch(`${CONFIG.SERVER_HOST}/bot/catagories/${userLang}`)
			const { data } = await rawData.json()

			// generate inline buttons
			let inlineKeyboard = helper.kbdGenerate(data, 'catagory', 1)

			bot.sendMessage(
				helper.getChatId(msg), 
				`
					<b>${info.name.toUpperCase()}</b>\n\n<a href="${info.link}">📖</a> <b>${text.sendCatalog[userLang]}</b>
				`,
				{
					parse_mode: 'html',
					reply_markup: {
						inline_keyboard: inlineKeyboard
					}
				}
			)

			// delete old message with inline keyboard
			bot.deleteMessage(
				helper.getChatId(msg), 
				helper.getMsgId(msg)
			)

			// edit step from start to catagories
			step.editStep(msg, 'catagories')

		} catch(e) {
			console.log(e)
		}

	}

	// user ask their orders
	if(msg.text === text.mainMenu.keyboard.myOrders[userLang]) {

		try {
			
			// get catagories
			const myOrders = await fetch(`${CONFIG.SERVER_HOST}/bot/myorders/${helper.getChatId(msg)}/${userLang}`)
			const { data } = await myOrders.json()

			if(data.length > 0) {

				let msgText = `${text.orderStatus.script.mainText[userLang]}\n\n`
				let statusText = ''
				let products = ''

				data.forEach(o => {

					products = JSON.stringify(o.product_name).split('","').join(', ').split('["').join('').split('"]').join('')

					switch (o.status) {
						case 1:
							statusText = text.orderStatus.waiting[userLang]
							break;
						case 2:
							statusText = text.orderStatus.taken[userLang]
							break;
						case 3:
							statusText = text.orderStatus.delivery[userLang]
							break;
						case 4:
							statusText = text.orderStatus.done[userLang]
							break;
						case 6:
							statusText = text.orderStatus.cancelled[userLang]
							break;	
					}

					msgText += `${text.orderStatus.script.id[userLang]} ${o.id}\n${text.orderStatus.script.orderDate[userLang]} ${o.created}\n${text.orderStatus.script.price[userLang]} ${o.price}\n${text.orderStatus.script.status[userLang]} ${statusText}\n${text.orderStatus.script.product[userLang]} ${products}\n\n`

				})

				// generate inline buttons
				// let inlineKeyboard = helper.kbdGenerate(data, 'myorder', 2)

				bot.sendMessage(
					helper.getChatId(msg), 
					msgText,
					{
						parse_mode: 'html',
					}
				)

				// delete old message with inline keyboard
				bot.deleteMessage(
					helper.getChatId(msg), 
					helper.getMsgId(msg)
				)

			} else {
				bot.sendMessage(
					helper.getChatId(msg), 
					text.noOrders[userLang],
					{
						parse_mode: 'html'
					}
				)

				// delete old message with inline keyboard
				bot.deleteMessage(
					helper.getChatId(msg), 
					helper.getMsgId(msg)
				)
			}


			// edit step from start to catagories
			// step.editStep(msg, 'myorders')

		} catch(e) {
			console.log(e)
		}

	} // end of if - user wants his orders

  // user wants their settings, info
	if(msg.text === text.mainMenu.keyboard.settings[userLang]) {

		// change step to settings
		step.editStep(msg, 'settings')

		try {

			// get client info
			const clientInfo = await fetch(`${CONFIG.SERVER_HOST}/bot/client/${helper.getChatId(msg)}`)
			const { data: [ clientObj ], status } = await clientInfo.json()

			if(status === 200) {

				// delete old message with inline keyboard
				bot.deleteMessage(
					helper.getChatId(msg), 
					helper.getMsgId(msg)
				)

				const clientInfoText = `<b>${text.clientInfo.name[userLang]}:</b> ${clientObj?.name || clientObj?.tg_name}\n<b>${text.clientInfo.region[userLang]}:</b> ${clientObj?.region}\n<b>${text.clientInfo.languageText[userLang]}:</b> ${text.clientInfo.language[clientObj?.language]}\n\n${text.clientInfo.text[userLang]}`

				// send data with inline keyboard
				bot.sendMessage(
					helper.getChatId(msg), 
					clientInfoText, 
					{
						parse_mode: 'html',
						reply_markup: {
			  			inline_keyboard: [
								[
									{ text: text.clientInfo.name[userLang], callback_data: 'change:name' },
									{ text: text.clientInfo.region[userLang], callback_data: 'change:region' },
									{ text: text.clientInfo.languageText[userLang], callback_data: 'change:language' }	
								]
							]
			  		}
					}
				) // end of sendMessage

			}

		} catch(e) {
			console.log(e)
		}

	} // user press Setting button


	// User wants delete his order
	if(!isNaN(msg.text - 0) && userStep.data[0].step_name === 'myorders') {

		const orderId = Number(msg.text)

		try {
			
			// const editOrder = await fetch(`${CONFIG.SERVER_HOST}/bot/orders`,{
			// 	method: 'put',
			// 	headers: {
			// 		'Content-type': 'application/json'
			// 	},
			// 	body: JSON.stringify({
			// 		order_id: orderId,
			// 		edit_code: 6
			// 	})
			// })

			const { status, data: [ orderObj ] } = await editOrder.json()

			if(status === 200 || status === 210) {

				let textOrderClean = text.orderStatus.script.cancelledOrder[userLang] + orderId

				if(status === 210) {
					textOrderClean = text.orderStatus.script.alreadyCancelledOrder[userLang]
				}

				// edit step from start to catagories
				step.editStep(msg, 'menu')

				// send main menu
				bot.sendMessage(
					helper.getChatId(msg), 
					textOrderClean, 
					{
						parse_mode: 'html',
						reply_markup: {
			  			keyboard: [
								[{ text: text.mainMenu.keyboard.order[userLang] }],
								[
									{ text: text.mainMenu.keyboard.myOrders[userLang] }, 
									{ text: text.mainMenu.keyboard.settings[userLang] }
								]
							],
			  			resize_keyboard: true,
			  			one_time_keyboard: true
			  		}
					}
				) // end of sendMessage

			}
		} catch(e) {
			console.log(e)
		}

	} // end of delete order

	const stepArr = currentStep.split(':')
	// user change his name
	if(stepArr[0] === 'change') {

		// change name
		if(stepArr[1] === 'name') {

			const editOrder = await fetch(`${CONFIG.SERVER_HOST}/bot/client/name`,{
				method: 'put',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					tg_user_id: helper.getChatId(msg),
					name: msg.text
				})
			})

			const { status, data } = await editOrder.json()

			if(status === 200) {

				// change step to settings
				step.editStep(msg, 'settings')

				// get client info
				const clientInfo = await fetch(`${CONFIG.SERVER_HOST}/bot/client/${helper.getChatId(msg)}`)
				const { data: [ clientObj ], status } = await clientInfo.json()
				const clientInfoText = `<b>${text.clientInfo.name[userLang]}:</b> ${clientObj?.name || clientObj?.tg_name}\n<b>${text.clientInfo.region[userLang]}:</b> ${clientObj?.region}\n<b>${text.clientInfo.languageText[userLang]}:</b> ${text.clientInfo.language[clientObj?.language]}\n\n${text.clientInfo.text[userLang]}`
				
				// send data with inline keyboard
				bot.sendMessage(
					helper.getChatId(msg), 
					clientInfoText, 
					{
						parse_mode: 'html',
						reply_markup: {
			  			inline_keyboard: [
								[
									{ text: text.clientInfo.name[userLang], callback_data: 'change:name' },
									{ text: text.clientInfo.region[userLang], callback_data: 'change:region' },
									{ text: text.clientInfo.languageText[userLang], callback_data: 'change:language' }	
								]
							]
			  		}
					}
				) // end of sendMessage

			}

		} // end of change name

	}

	// User pressed back keyboard
	if(msg.text === '🔙🏡' || msg.text === '/menu') {

		// change step
		step.editStep(msg, 'menu')

		// send main menu
		bot.sendMessage(
			helper.getChatId(msg), 
			text.mainMenu.text[userLang], 
			{
				parse_mode: 'html',
				reply_markup: {
	  			keyboard: [
						[{ text: text.mainMenu.keyboard.order[userLang] }],
						[
							{ text: text.mainMenu.keyboard.myOrders[userLang] }, 
							{ text: text.mainMenu.keyboard.settings[userLang] }
						]
					],
	  			resize_keyboard: true,
	  			one_time_keyboard: true
	  		}
			}
		) // end of sendMessage

	} // end of if - back button

} // end of callbacj func

module.exports = {
	getAction,
}
