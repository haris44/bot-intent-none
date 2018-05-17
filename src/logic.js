export const logic = ($message) => {
    return new Promise((resolve) => {
        const newMessage = Object.assign($message, { content: 'Je n\'ai malheuresement pas compris ton message' })
        resolve(newMessage)
    })
}