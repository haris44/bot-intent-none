import test from 'ava'
import { logic } from '../src/logic'

test(t => {
    return logic({ message: { content: 'taGrandeRace' } }).then(element => {
        t.true(element.content === 'Je n\'ai malheuresement pas compris ton message')
    })
})