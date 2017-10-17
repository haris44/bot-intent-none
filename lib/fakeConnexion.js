class Connexion {

    constructor() {
        this.assertedQueue = []
        this.bindedQueue = []
        this.consumer = []
        this.published = []
    }

    getPublished() {
        return this.published
    }

    registerConsumer(queue, fn) {
        this.consumer.push({ queue: queue, fn: fn })
    }

    sendToConsumer(queue, message) {
        this.consumer
            .find(element => element.queue === queue)
            .fn({ content: message })

    }
    registerPublisher(obj) {
        this.published.push(obj)
    }

    createChannel(fn) {
        fn('', {
            assertExchange: (exchange, type, durable) => {
                this.exchange = {
                    exchange: exchange,
                    type: type,
                    durable: durable
                }
            },
            assertQueue: (queue, durable, callback) => {
                this.assertedQueue.push({
                    queue: queue,
                    durable: durable,
                    callback: (() => {
                        callback('', { queue: queue })
                    })()
                })
            },
            bindQueue: (queue, exchange, bindingKey) => {
                this.bindedQueue.push({
                    queue: queue,
                    exchange: exchange,
                    bindingKey: bindingKey
                })
            },
            consume: (q, fn) => this.registerConsumer(q, fn),
            publish: (exchange, apiKey, buffer) => this.registerPublisher({
                exchange: exchange,
                apiKey: apiKey,
                buffer: buffer
            })
        })
    }
}


export const fakeConnexion = Promise.resolve(new Connexion())