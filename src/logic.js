export const logic = ($message) => {
    const newMessage = Object.assign($message.message, { content: 'Je n\'ai malheuresement pas compris ton message' })
    return Object.assign($message, { message: newMessage })
}