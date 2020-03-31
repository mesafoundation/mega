require('dotenv').config()

const jwt = require('jsonwebtoken')
const { default: Mesa } = require('@cryb/mesa')

const { parseConfig, log } = require('./utils')

const server = new Mesa({
	...parseConfig()
})

log(`Listening on :${process.env.MESA_PORT || 4500}`)

server.on('connection', client => {
	log('Client connected')

	client.authenticate(async ({ token }, done) => {
		try {
			const { id } = jwt.verify(token, process.env.WS_KEY)
			log('Authenticated', id)

			done(null, { id, user: { id } })
		} catch(error) {
			done(error)
		}
	})

	client.on('message', message => {
		log('Recieved', message, 'from', client.id)
	})

	client.on('disconnect', (code, reason) => {
		log('Client disconnected', code, reason)
	})
})
