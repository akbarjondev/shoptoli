const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
	sign: async (payload) => await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }), // payload must be Object {foo: 'bar'}
	verify: async (token) => await jwt.verify(token, process.env.JWT_SECRET)
}
