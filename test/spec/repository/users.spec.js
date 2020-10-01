'use strict'

const { expect } = require('chai')
const users = require('../../../lib/repository/users')

describe('Users', () => {
    after(() => {
        return users._close()
    })
    describe('.getUser', () => {
        it('returns a user that was previously added', async () => {
            await users.addUser('Tony', 'tony@stark.com')
            const user = await users.getUserByName('Tony')
            expect(user.name).to.equal('Tony')
            expect(user.email).to.equal('tony@stark.com')
        })
    })
})