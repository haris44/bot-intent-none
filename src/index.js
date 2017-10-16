import { connexion } from './rabbitConnexion'
import { assertQueue, sendTo } from './rabbitUtils'

const connexionEstablished = connexion()

assertQueue(connexionEstablished, ($message) => {
    const newMessage = Object.assign($message.message, { content: 'Je n\'ai malheuresement pas compris ton message' })
    const newIntentMessage = Object.assign($message, { message: newMessage })
    sendTo(connexionEstablished, JSON.stringify(newIntentMessage))
})
