'use strict'

const Mongo = require('mongodb').MongoClient

const configuration = require('../configuration/configuration')
const mongoUrl = configuration.getMongoDbUrl()
const mongoDbName = configuration.getMongoDbName()

module.exports = class {

    constructor(schemaName) {
        this._schemaName = schemaName
        this._db = null
        this._client = null

        process.on('SIGINT', () => {
            this._close()
        })
    }

    async _verifyConnected() {
        if (this._db) {
            return Promise.resolve(this._db)
        } else {
            return this._connect()
        }
    }

    async _connect() {
        this._client = await Mongo.connect(mongoUrl, {
            useUnifiedTopology: true
        })

        this._db = this._client.db(mongoDbName)

        return this._db
    }

    async _close() {
        if (!this._client) {
            return Promise.resolve()
        } else {
            await this._client.close()
            this._client = null
            this._db = null
        }
    }
}