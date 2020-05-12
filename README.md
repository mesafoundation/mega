# mega
Gateway server utilising Mesa

## Introduction
Mega is a simple Gateway server intended for deployment alongside an internal API or set of microservices. It utilises [Mesa](https://github.com/crybapp/mesa), a scalable, robust and modern WebSocket wrapper.

While most configuration can happen inside the `.env` file, Mega can be customised in any way from the single `index.js` file. Further customisation options are available [here](https://github.com/crybapp/mesa#server-side).

## Setting Up Mega
Mega is simple to setup. Instructions for manual setup are provided here, or you can wait for us to provide instructions for a Docker or Kubernetes-based setup.
<!-- or you can look at deployment using Docker or Kubernetes [here](#deployment). -->

### Installation
Firstly install the required dependencies. The following command uses [Yarn](https://yarnpkg.com):
```
yarn
```
If you're using [NPM](https://npmjs.com), run:
```
npm install
```

### Setup

Mega uses the `.env` format for environment setup. Simply clone `.env.example` to `.env` using the following command:

```
cp .env.example .env
```

Documentation on environment variables is available in the `.env.example` / `.env` file.

Now you're done with setup, learn how to [start Mega](#usage).

## Usage
To run the Mega server, simply run the following if you're using [Yarn](https://yarnpkg.com):
```
yarn start
```
or, if you're using [NPM](https://npmjs.com):
```
npm start
```

### Dispatching Events to Mega
You can use the Mesa Dispatch API in order to send events from external services to Mega to be broadcasted to clients.

Here's an example of a chat service dispatching messages to Mega:
```js
// Import 'Message' and 'Dispatcher' from the Mesa library
const { Message, Dispatcher } = require('@cryb/mesa')

const chat = require('./chat_manager.js')

// Create a Dispatcher instance using the same Redis URI as your Mega instance
const dispatcher = new Dispatcher('redis://localhost:6379', {
	// If you're using a Mesa namespace, remember to leave it in the config
	// If you're not, remove the config from the Dispatcher constructor
	namespace: 'chat'
})

// When the Chat EventEmitter emits a new message
chat.on('message', ({ content, author, room }) => {
	// Dispatch the message using Dispatcher to all connected Mega clients in the room
	// Dispatcher takes in two parameters: the Message object and an array of user ids. The second argument maps the user id from the 'users' property on the room object. Remember this is for example purposes only
	dispatcher.dispatch(new Message(0, { content, author }, 'NEW_MESSAGE'), [...room.users.map(({ id }) => id)])
})

// Examples for user_join and user_leave events

chat.on('user_join', ({ userId, room }) => {
	dispatcher.dispatch(new Message(0, { userId }, 'USER_JOIN'), [...room.users.map(({ id }) => id)])
})

chat.on('user_leave', ({ userId, room }) => {
	dispatcher.dispatch(new Message(0, { userId }, 'USER_LEAVE'), [...room.users.map(({ id }) => id)])
})
```

A simpler application you can run would consist of the following:
```js
// Import 'Message' and 'Dispatcher' from the Mesa library
const { Message, Dispatcher } = require('@cryb/mesa')

// Create a Dispatcher instance using the same Redis URI as your Mega instance
const dispatcher = new Dispatcher('redis://localhost:6379')

// Dispatch the Message object to all clients connected to the Mega server
dispatcher.dispatch(new Message(0, { hello: 'world' }, 'EXAMPLE_EVENT'), ['*'])
```

<!-- ## Deployment
### Docker
The latest Docker image for Mega is kept on the GitHub Package Registry. See [here]() for more details.

### Kubernetes
Mega provides an example set of Kubernetes deployment files under the `deployment/kubernetes` directory. -->

## Troubleshooting
### Cloudflare
By default, Cloudflare terminates dormant WebSocket connections after 100 seconds. To bypass this, either upgrade your site to an 'Enterprise' plan, or enable heartbeats in your environment variables:
```yml
HEARTBEATS_ENABLED: 'true'
HEARTBEAT_INTERVAL: '10000'
```

Learn more about this [here](https://community.cloudflare.com/t/cloudflare-websocket-timeout/5865)

### Kubernetes
#### ingress-nginx
When using Mega with `ingress-nginx`, some changes need to be made to support long-lasting connections.

By default, `ingress-nginx` will time out WebSocket connections after 60 seconds. If your implementation of Mega keeps connections under 60 seconds then you can stop reading.

If you rely on longer connections, add the following options to your `ingress-nginx` configuration using a ConfigMap or via Annotations:
```yml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600" # 1 hour
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "3600" # 1 hour
```

Learn more about this [here](https://kubernetes.github.io/ingress-nginx/user-guide/miscellaneous/#websockets)

## Questions / Issues
If you have an issues with Mega, please either open a GitHub issue or contact a maintainer