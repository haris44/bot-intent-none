class Connexion {

    constructor() {
        this.assertedQueue = []
        this.bindedQueue = []
        this.consumer = []
    }

    registerConsumer(queue, fn) {
        this.consumer.push({ queue: queue, fn: fn })
    }

    sendToConsumer(queue, message) {
        this.consumer
            .find(element => element.queue === queue)
            .fn({ content: message })

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
            consume: (q, fn) => this.registerConsumer(q, fn)

        })
    }
}


export const connexion = Promise.resolve(new Connexion())