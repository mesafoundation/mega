_**Mega** — Gateway server utilising Mesa_

Mega is a simple Gateway server intended for deployment alongside an internal API or set of microservices. It utilises [Mesa](https://github.com/crybapp/mesa), a scalable, robust and modern WebSocket wrapper.

While most configuration can happen inside the `.env` file, Mega can be customised in any way from the single `index.js` file. Further customisation options are available [here](https://github.com/crybapp/mesa#server-side).

## Docs
* [Setting Up Mega](#setting-up-mega)
	* [Installation](#installation)
	* [Setup](#setup)
* [Usage](#usage)
	* [Dispatching Events to Mega](#dispatching-events-to-mega)
* [Questions / Issues](#questions--issues)

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

## Questions / Issues
If you have an issues with Mega, please either open a GitHub issue or contact a maintainer