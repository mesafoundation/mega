require('dotenv').config({ path: '../.env' })

const { Dispatcher, Message } = require('@cryb/mesa')

const dispatcher = new Dispatcher(process.env.REDIS_SENTINEL || process.env.REDIS_URI, {
	namespace: process.env.MESA_NAMESPACE
})

setInterval(() =>
	dispatcher.dispatch(new Message(0, { time: Date.now() }, 'SERVER_TIME')),
1000)