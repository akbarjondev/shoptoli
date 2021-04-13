const fetch = require('node-fetch')
const CONFIG = require('./../../config/config')
const helper = require('./../../helper')
const text = require('./../../texts')
const step = require('./../step/step.model')

const getAction = async (msg) => {

	// get to know user's language
	const userLang = await helper.getUserObj(helper.getChatId(msg))

	// get user's step
	const userStep = await step.getStep(msg)

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
					msgText + text.orderStatus.script.cancelMainText[userLang],
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
			step.editStep(msg, 'myorders')

		} catch(e) {
			console.log(e)
		}

	} // end of if - user wants his orders

	// User wants delte his order
	if(!isNaN(msg.text - 0) && userStep.data[0].step_name === 'myorders') {

		const orderId = Number(msg.text)

		try {
			
			const editOrder = await fetch(`${CONFIG.SERVER_HOST}/bot/orders`,{
				method: 'put',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					order_id: orderId,
					edit_code: 6
				})
			})

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

	// User pressed back keyboard
	if(msg.text === '🔙🏡') {

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
