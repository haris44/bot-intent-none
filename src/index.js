import { connexion } from './rabbitConnexion'
import { assertQueue, sendTo } from './rabbitUtils'
import { logic } from './logic'

const connexionEstablished = connexion()

assertQueue(connexionEstablished, ($message) => {
    logic($message).then(response => {
        if (response.length >= 1) {
            response.forEach(element => {
                console.log(element)
                sendTo(connexionEstablished, JSON.stringify(element))
            });
        } else {
            sendTo(connexionEstablished, JSON.stringify(response))
        }
    }).catch((err) => {
        console.error(err)
    })
})