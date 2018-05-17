export const logic = ($message) => {
    return new Promise((resolve) => {
        console.log($message)
        const newMessage1 = Object.assign({}, $message, { content: 'Je n\'ai malheuresement pas compris ton message' })
        const newMessage2 = Object.assign({}, $message, { content: "Mais n'hésite pas à réessayer avec une autre formulation !" })
        resolve([newMessage1, newMessage2])
    })
}