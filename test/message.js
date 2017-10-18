import test from 'ava'
import { logic } from '../src/logic'
test(t => {
    const response = logic({ message: { content: 'test' } })
    t.deepEqual('Je n\'ai malheuresement pas compris ton message', response.message.content)
})
