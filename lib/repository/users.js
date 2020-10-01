'use strict'

const Base = require('./base')

const USERS_COLLECTION = "users"

module.exports = new class extends Base {

    constructor() {
        super(USERS_COLLECTION)
    }

    async addUser(name, email) {
        const db = await this._verifyConnected()
        const model = {
            name, email
        }
        return db.collection(USERS_COLLECTION).insertOne(model)
    }

    async getUserByName(name) {
        const db = await this._verifyConnected()
        const search = {
            name
        }
        return db.collection(USERS_COLLECTION).findOne(search)
    }
}