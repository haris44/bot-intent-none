import { hello } from './hello'

export const logic = ($message) => {
    return new Promise((resolve, reject) => {
        const newMessage = Object.assign({}, $message, { content: hello[Math.floor(Math.random() * hello.length)] })
        resolve(newMessage)
    })
}