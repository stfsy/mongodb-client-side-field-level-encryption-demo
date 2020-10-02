'use strict'

const Base = require('./base')
const uuid = require('uuid').v4

const USERS_COLLECTION = "users"

module.exports = new class extends Base {

    constructor() {
        super(USERS_COLLECTION)
    }

    async addUser(name, email) {
        const db = await this._verifyConnected()
        const encryptedModel = await this.encrypt({
            name, email
        })
        encryptedModel.id = uuid()
        return db.collection(USERS_COLLECTION).insertOne(encryptedModel)
    }

    async getUserByName(name) {
        const db = await this._verifyConnected()
        const search = await this.encrypt({
            name
        })
        const user = await db.collection(USERS_COLLECTION).findOne(search)
        const decrypted = await this.decrypt({ name: user.name, email: user.email })
        return decrypted
    }
}