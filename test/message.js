import test from 'ava'
import { logic } from '../src/logic'

test(t => {
    return logic({ message: { content: 'taGrandeRace' } }).then(element => {
        t.deepEqual(element[0].content, 'Je n\'ai malheuresement pas compris ton message')
        t.deepEqual(element[1].content, "Mais n'hésite pas à réessayer avec une autre formulation !")

    })
})