require('dotenv').config({ path: '../.env' })

const { Client, Message } = require('@cryb/mesa')
const { sign } = require('jsonwebtoken')

const client = new Client(`ws://localhost:${process.env.MESA_PORT || '4500'}`)

client.on('connected', async () => {
	console.log('Connected to Mega')
	
	const token = sign({ id: Math.round(Math.random() * 1000) }, process.env.WS_KEY)
	await client.authenticate({ token })
	console.log('Authenticated with Mega')
})

client.on('message', (data, type) =>
    console.log('Recieved', data, type)
)

client.on('disconnected', (code, reason) =>
    console.log('Disconnected from Mega', code, reason)
)
