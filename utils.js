const parseSentinels = sentinels =>
	sentinels.split(',').map(uri => ({
		host: uri.split(':')[1].replace('//', ''),
		port: parseInt(uri.split(':')[2])
	})), // Parse sentinels from process env
	getOptions = () => { // Get Options Method
		if (!process.env.REDIS_URI && !process.env.REDIS_SENTINELS)
			throw new Error('No value was found for REDIS_URI or REDIS_SENTINELS - make sure .env is setup correctly!')

		if (process.env.REDIS_SENTINELS)
			return {
				sentinels: parseSentinels(process.env.REDIS_SENTINELS),
				name: 'mymaster'
			}

		if (process.env.REDIS_URI) {
			const uri = new URL(process.env.REDIS_URI)

			return {
				host: uri.hostname || 'localhost',
				port: parseInt(uri.port) || 6379,
				db: parseInt(uri.pathname) || 0,
				password: uri.password ? decodeURIComponent(uri.password) : null
			}
		}
	}

module.exports.parseConfig = () => ({
	port: process.env.MESA_PORT ? parseInt(process.env.MESA_PORT) : 4500,
	namespace: process.env.MESA_NAMESPACE || undefined,
	redis: getOptions(),

	client: {
		enforceEqualVersions: process.env.ENFORCE_EQUAL_VERSIONS === 'true' ? true : false
	},
	options: {
		storeMessages: process.env.STORE_MESSAGES === 'true' ? true : false
	},

	heartbeat: {
		enabled: process.env.HEARTBEATS_ENABLED === 'true' ? true : false,
		interval: process.env.HEARTBEAT_INTERVAL ? parseInt(process.env.HEARTBEAT_INTERVAL) : 10000,
		maxAttempts: process.env.HEARTBEAT_MAX_ATTEMPTS ? parseInt(process.env.HEARTBEAT_MAX_ATTEMPTS) : 3
	},
	reconnect: {
		enabled: process.env.RECONNECTS_ENABLED === 'true' ? true : false,
		interval: process.env.RECONNECT_INTERVAL ? parseInt(process.env.RECONNECT_INTERVAL) : 50000
	},
	authentication: {
		timeout: process.env.AUTH_TIMEOUT ? parseInt(process.env.RECONNECT_INTERVAL) : 10000,
		sendUserObject: process.env.AUTH_SEND_USER_OBJECT !== 'false' ? true : false,
		disconnectOnFail: process.env.AUTH_DISCONNECT_ON_FAIL !== 'false' ? true : false,
		storeConnectedUsers: process.env.AUTH_STORE_CONNECTED_USERS !== 'false' ? true : false
	}
})

module.exports.log = (...items) => {
	if(process.env.ENABLE_LOGGING === 'false')
		return

	console.log(`[MEGA-${process.env.NODE_ENV.toUpperCase()}]`, ...items)
}
