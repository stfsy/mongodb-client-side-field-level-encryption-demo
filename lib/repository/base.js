'use strict'

const Mongo = require('mongodb').MongoClient
const ClientEncryption = require('mongodb-client-encryption').ClientEncryption

const configuration = require('../configuration/configuration')
const encryptionKey = configuration.getMongoEncryptionKey()
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

        const collections = await this._db.listCollections().toArray()
        const isAlreadyCreated = collections.some(collection => {
            return collection.name === this._schemaName
        })

        // if the collection already exists we only update the schema
        // but there's a catch.. read the comment below
        if (!isAlreadyCreated) {
            try {
                await this._db.createCollection(this._schemaName)
            } catch (e) {
                // may be only a unit/integration-test test problem
                // but we can't always determine if collection already exists
                // if codeName equals NamespaceExists the collection
                // was created asynchronously and we can carry on
                // else.. throw the error
                if (e.codeName != 'NamespaceExists') {
                    throw e
                }
            }
        }

        await this._db.command({
            collMod: this._schemaName,
            validator: {
                $jsonSchema: require('./schemas/' + this._schemaName + '.json')
            },
            validationLevel: "strict"
        })

        this._clientEncryption = new ClientEncryption(this._client, {
            keyVaultNamespace: 'encryption.__keys',
            kmsProviders: {
                local: {
                    key: Buffer.from(encryptionKey, 'base64')
                }
            }
        })

        return this._db
    }

    encrypt(object, random) {
        return this._transformObject(object, (value) => {
            return this._clientEncryption.encrypt(value, {
                keyAltName: 'www',
                algorithm: random ? 'AEAD_AES_256_CBC_HMAC_SHA_512-Random' : 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
            })
        })
    }

    decrypt(object) {
        return this._transformObject(object, (value) => {
            return this._clientEncryption.decrypt(value)
        })
    }

    _transformObject(object, callback) {
        if (!object) {
            return
        }
        if (typeof object === 'string') { // string ENcryption
            return callback(object)
        }

        if (object._bsontype === 'Binary') { // string DEcryption
            return callback(object)
        }

        const transformedObject = {}
        return Promise.all(Object.keys(object).map((key) => {
            return callback(object[key]).then((value) => {
                transformedObject[key] = value
            })
        })).then(() => {
            return transformedObject
        })
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