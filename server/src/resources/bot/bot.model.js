const { fetch } = require('./../../db/db')

//=========================== CLIENT ===========================//

const addClient = async (arr) => {

	try {
		
		const CREATE_ONE_CLIENT = `
			insert into clients
				(tg_user_id, tg_first_name, tg_last_name, tg_username)
			values
				($1, $2, $3, $4)
			returning
				client_id,
				tg_user_id
		`

		const data = await fetch(CREATE_ONE_CLIENT, arr)

		return {
			status: 200,
			message: 'client added',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const getOneClient = async (arr) => {

}

//=========================== STEP ===========================//



const addStep = async (arr) => {

	try {
		
		const ADD_STEP = `
			insert into steps
				(step_name, tg_user_id)
			values
				($1, $2)
			returning
				step_id
		`

		const data = await fetch(ADD_STEP, arr)

		return {
			status: 200,
			message: 'step added',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const getStep = async (arr) => {

	try {
		
		const GET_STEP = `
			select
				step_id,
				step_name
			from
				steps
			where
				tg_user_id = $1
		`

		const data = await fetch(GET_STEP, arr)

		if(data.length > 0) {
			
			return {
				status: 200,
				message: 'ok',
				data: data
			}

		} else {
			return {
				status: 404,
				message: 'step not found',
			}			
		}


	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const editStep = async (arr) => {

	try {
		
		const EDIT_STEP = `
			update 
				steps
			set
				step_name = $1
			where
				tg_user_id = $2
			;
		`

		const data = await fetch(EDIT_STEP, arr)

		return {
			status: 200,
			message: 'ok',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

module.exports = {
	addClient,
	addStep,
	getOneClient,
	editStep,
	getStep,
}
