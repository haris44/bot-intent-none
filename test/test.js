import 'process'
import test from 'ava'
import { connexion } from '../lib/rabbitFake'
import { assertQueue } from '../src/rabbitUtils'


const assertQueueTest = (connexion) => {
    return new Promise((resolve, reject) => {
        assertQueue(connexion, resolve)
        connexion.then((conn) => conn.sendToConsumer('none.queue', '{ "test" : "test"}'))
    })
}

test(t => {

    process.env.RABBIT_EXCHANGE = 'exchange'
    process.env.RABBIT_INTENT_API_BINDING = 'api.binding'
    process.env.RABBIT_INTENT_NONE_QUEUE = 'none.queue'
    process.env.RABBIT_INTENT_NONE_BINDING = 'none.binding'

    return assertQueueTest(connexion).then((msg) => {
        t.pass()
    })
})
